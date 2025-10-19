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
                echo '📦 Checking out code from Git...'
                git branch: 'main', url: 'https://github.com/t-kiran-05/mern-app-devops.git'
            }
        }
        
        stage('Configure Environment') {
            steps {
                echo '⚙️ Creating environment files for Jenkins deployment...'
                sh """
                # Create backend .env with correct port
                echo "MONGO_URI=mongodb://${MONGO_CONTAINER_NAME}:27017/mern-ecommerce" > backend/.env.jenkins
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
                # Create custom network for Jenkins deployment
                docker network create ${NETWORK_NAME} || true
                
                # Stop and remove only Jenkins containers
                docker stop ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                docker rm ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                
                # Build images
                docker build -t backend-jenkins ./backend
                docker build -t frontend-jenkins ./frontend
                
                # Run MongoDB first
                docker run -d \\
                  --name ${MONGO_CONTAINER_NAME} \\
                  -p ${MONGO_PORT}:27017 \\
                  -v ${MONGO_VOLUME}:/data/db \\
                  --network ${NETWORK_NAME} \\
                  mongo:6.0
                
                # Run backend (wait for MongoDB)
                sleep 5
                docker run -d \\
                  --name ${BACKEND_CONTAINER_NAME} \\
                  -p ${BACKEND_PORT}:5000 \\
                  --env-file backend/.env.jenkins \\
                  --network ${NETWORK_NAME} \\
                  backend-jenkins
                
                # Run frontend  
                docker run -d \\
                  --name ${FRONTEND_CONTAINER_NAME} \\
                  -p ${FRONTEND_PORT}:3000 \\
                  --env-file frontend/.env.jenkins \\
                  --network ${NETWORK_NAME} \\
                  frontend-jenkins
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
            sh 'docker ps | grep jenkins'
        }
        success {
            echo '✅ Pipeline completed successfully!'
            echo "🎯 Jenkins Deployment URLs:"
            echo "Frontend: http://${EC2_IP}:${FRONTEND_PORT}"
            echo "Backend API: http://${EC2_IP}:${BACKEND_PORT}"
            echo "MongoDB: ${EC2_IP}:${MONGO_PORT}"
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
