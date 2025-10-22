pipeline {
    agent any
    environment {
        EC2_IP = '13.218.248.152'
        BACKEND_PORT = '5001'
        FRONTEND_PORT = '3001'
        BACKEND_CONTAINER_NAME = 'backend-jenkins'
        FRONTEND_CONTAINER_NAME = 'frontend-jenkins'
        MONGO_CONTAINER_NAME = 'mongo-jenkins'
        MONGO_PORT = '27018'
        MONGO_VOLUME = 'mongo-data-jenkins'
        NETWORK_NAME = 'mern-net-jenkins'
    }
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out LATEST code from Git...'
                git branch: 'main', url: 'https://github.com/t-kiran-05/mern-app-devops.git'
                
                // Show what changed
                sh '''
                echo "=== Latest Commit ==="
                git log -1 --oneline
                echo "=== Changed Files ==="
                git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "First build or cannot detect changes"
                '''
            }
        }
        
        stage('Configure Environment') {
            steps {
                echo '⚙️ Creating environment files for Jenkins deployment...'
                sh """
                # Create backend .env.jenkins
                echo "MONGO_URI=mongodb://${MONGO_CONTAINER_NAME}:27017/mern-ecommerce" > backend/.env.jenkins
                echo "NODE_ENV=production" >> backend/.env.jenkins
                echo "SECRET_KEY=mysecret123" >> backend/.env.jenkins
                echo "PORT=5000" >> backend/.env.jenkins
                
                # Create frontend .env.jenkins
                echo "REACT_APP_API_URL=http://${EC2_IP}:${BACKEND_PORT}" > frontend/.env.jenkins
                """
            }
        }
        
        stage('Cleanup Previous Deployment') {
            steps {
                echo '🧹 Stopping previous Jenkins deployment...'
                sh """
                # Stop and remove ONLY Jenkins containers (keep manual deployment running)
                docker stop ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                sleep 5
                docker rm ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                
                # Clean up old images to save space
                docker system prune -f || true
                """
            }
        }
        
        stage('Build Updated Images') {
            steps {
                echo '🏗️ Building UPDATED Docker images...'
                sh """
                # Rebuild backend with latest code
                docker build -t backend-jenkins ./backend
                echo "✅ Backend image rebuilt with latest code"
                
                # Rebuild frontend with latest code
                docker build -t frontend-jenkins ./frontend
                echo "✅ Frontend image rebuilt with latest code"
                """
            }
        }
        
        stage('Deploy Updated Application') {
            steps {
                echo '🚀 Deploying UPDATED containers...'
                sh """
                # Create network if it doesn't exist
                docker network create ${NETWORK_NAME} || true
                
                # Start MongoDB
                docker run -d \\
                  --name ${MONGO_CONTAINER_NAME} \\
                  -p ${MONGO_PORT}:27017 \\
                  -v ${MONGO_VOLUME}:/data/db \\
                  --network ${NETWORK_NAME} \\
                  mongo:6.0
                echo "✅ MongoDB started"
                
                # Wait for MongoDB
                sleep 10
                
                # Start backend with UPDATED code
                docker run -d \\
                  --name ${BACKEND_CONTAINER_NAME} \\
                  -p ${BACKEND_PORT}:5000 \\
                  --env-file backend/.env.jenkins \\
                  --network ${NETWORK_NAME} \\
                  backend-jenkins
                echo "✅ Backend deployed with latest code"
                
                # Wait for backend
                sleep 10
                
                # Start frontend with UPDATED code
                docker run -d \\
                  --name ${FRONTEND_CONTAINER_NAME} \\
                  -p ${FRONTEND_PORT}:3000 \\
                  --env-file frontend/.env.jenkins \\
                  --network ${NETWORK_NAME} \\
                  frontend-jenkins
                echo "✅ Frontend deployed with latest code"
                """
            }
        }
        
        stage('Verify Updated Deployment') {
            steps {
                echo '🔍 Verifying UPDATED deployment...'
                sh """
                # Wait for everything to start
                sleep 20
                
                echo "=== Container Status After Update ==="
                docker ps | grep jenkins
                
                # Test the UPDATED application
                echo "Testing UPDATED backend..."
                curl -f http://${EC2_IP}:${BACKEND_PORT}/api/products && echo "✅ UPDATED Backend working"
                
                echo "Testing UPDATED frontend..."
                curl -f http://${EC2_IP}:${FRONTEND_PORT} && echo "✅ UPDATED Frontend working"
                """
            }
        }
    }
    post {
        success {
            echo '🎉 AUTOMATIC DEPLOYMENT SUCCESSFUL!'
            echo "Latest code is now live at: http://${EC2_IP}:${FRONTEND_PORT}"
            sh """
            echo "=== Deployment Summary ==="
            echo "Manual (Stable): http://${EC2_IP}:3000"
            echo "Jenkins (Latest): http://${EC2_IP}:${FRONTEND_PORT}"
            echo "Backend API: http://${EC2_IP}:${BACKEND_PORT}/api/products"
            echo "Latest commit:"
            git log -1 --oneline
            """
        }
        failure {
            echo '❌ Automatic deployment failed! Manual deployment still running.'
        }
    }
}
