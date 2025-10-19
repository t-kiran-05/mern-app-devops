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
    }
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code from Git...'
                git branch: 'main', url: 'https://github.com/t-kiran-05/mern-app-devops.git'
            }
        }
        
        stage('Configure Environment') {
            steps {
                echo '⚙️ Creating environment files for Jenkins deployment...'
                sh """
                # Create backend .env with correct port
                echo "MONGO_URI=mongodb://mongo:27017/mern-ecommerce" > backend/.env.jenkins
                echo "NODE_ENV=production" >> backend/.env.jenkins
                echo "PORT=5000" >> backend/.env.jenkins
                
                # Create frontend .env with correct backend port
                echo "REACT_APP_API_URL=http://${EC2_IP}:${BACKEND_PORT}" > frontend/.env.jenkins
                """
            }
        }
        
        stage('Build and Deploy') {
            steps {
                echo '🐳 Building and deploying with Docker Compose (Jenkins ports)...'
                sh """
                # Stop and remove only Jenkins containers to avoid affecting manual deployment
                sudo docker stop ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                sudo docker rm ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                
                # Build and run with custom ports and container names
                sudo docker build -t backend-jenkins ./backend
                sudo docker build -t frontend-jenkins ./frontend
                
                # Run backend
                sudo docker run -d \\
                  --name ${BACKEND_CONTAINER_NAME} \\
                  -p ${BACKEND_PORT}:5000 \\
                  --env-file backend/.env.jenkins \\
                  --network mern-app-devops_mern-net \\
                  backend-jenkins
                
                # Run frontend  
                sudo docker run -d \\
                  --name ${FRONTEND_CONTAINER_NAME} \\
                  -p ${FRONTEND_PORT}:3000 \\
                  --env-file frontend/.env.jenkins \\
                  --network mern-app-devops_mern-net \\
                  frontend-jenkins
                
                # Run MongoDB
                sudo docker run -d \\
                  --name ${MONGO_CONTAINER_NAME} \\
                  -p ${MONGO_PORT}:27017 \\
                  -v ${MONGO_VOLUME}:/data/db \\
                  --network mern-app-devops_mern-net \\
                  mongo:6.0
                """
            }
        }
        
        stage('Test Application') {
            steps {
                echo '🧪 Testing application connectivity...'
                sh 'sleep 15'
                sh "curl -f http://${EC2_IP}:${FRONTEND_PORT} || exit 1"
                sh "curl -f http://${EC2_IP}:${BACKEND_PORT} || exit 1"
            }
        }
    }
    post {
        always {
            echo '📊 Pipeline completed. Checking container status:'
            sh 'sudo docker ps'
        }
        success {
            echo '✅ Pipeline completed successfully!'
            echo "🎯 Jenkins Deployment URLs:"
            echo "Frontend: http://${EC2_IP}:${FRONTEND_PORT}"
            echo "Backend API: http://${EC2_IP}:${BACKEND_PORT}"
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
