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
                # Create backend .env.jenkins with correct MongoDB connection
                echo "MONGO_URI=mongodb://${MONGO_CONTAINER_NAME}:27017/mern-ecommerce" > backend/.env.jenkins
                echo "NODE_ENV=production" >> backend/.env.jenkins
                echo "SECRET_KEY=mysecret123" >> backend/.env.jenkins
                echo "PORT=5000" >> backend/.env.jenkins
                
                # Create frontend .env.jenkins with Jenkins backend port (5001)
                echo "REACT_APP_API_URL=http://${EC2_IP}:${BACKEND_PORT}" > frontend/.env.jenkins
                """
            }
        }
        
        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up previous Jenkins deployment...'
                sh """
                # Clean up Docker to save space
                docker system prune -f || true
                
                # Remove old network and recreate
                docker network rm ${NETWORK_NAME} || true
                sleep 2
                docker network create ${NETWORK_NAME} || true
                
                # Stop and remove ONLY Jenkins containers
                docker stop ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                sleep 2
                docker rm ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                """
            }
        }
        
        stage('Build Images') {
            steps {
                echo '🏗️ Building Docker images...'
                sh """
                # Build backend
                echo "Building backend image..."
                docker build -t backend-jenkins ./backend || {
                    echo "❌ Backend build failed"
                    exit 1
                }
                
                # Build frontend with retry logic
                echo "Building frontend image..."
                if ! docker build -t frontend-jenkins ./frontend; then
                    echo "⚠️ Frontend build failed, retrying..."
                    sleep 5
                    docker build -t frontend-jenkins ./frontend || {
                        echo "❌ Frontend build failed after retry"
                        exit 1
                    }
                fi
                echo "✅ Both images built successfully"
                """
            }
        }
        
        stage('Deploy Containers') {
            steps {
                echo '🐳 Deploying containers...'
                sh """
                # Verify images exist
                docker images | grep jenkins || {
                    echo "❌ Jenkins images not found"
                    exit 1
                }
                
                # Run MongoDB first
                echo "Starting MongoDB..."
                docker run -d \\
                  --name ${MONGO_CONTAINER_NAME} \\
                  -p ${MONGO_PORT}:27017 \\
                  -v ${MONGO_VOLUME}:/data/db \\
                  --network ${NETWORK_NAME} \\
                  mongo:6.0 || {
                    echo "❌ MongoDB failed to start"
                    exit 1
                }
                
                # Wait for MongoDB to be ready
                echo "Waiting for MongoDB..."
                sleep 15
                
                # Run backend
                echo "Starting backend..."
                docker run -d \\
                  --name ${BACKEND_CONTAINER_NAME} \\
                  -p ${BACKEND_PORT}:5000 \\
                  --env-file backend/.env.jenkins \\
                  --network ${NETWORK_NAME} \\
                  backend-jenkins || {
                    echo "❌ Backend failed to start"
                    exit 1
                }
                
                # Wait for backend to be ready
                echo "Waiting for backend..."
                sleep 15
                
                # Run frontend
                echo "Starting frontend..."
                docker run -d \\
                  --name ${FRONTEND_CONTAINER_NAME} \\
                  -p ${FRONTEND_PORT}:3000 \\
                  --env-file frontend/.env.jenkins \\
                  --network ${NETWORK_NAME} \\
                  frontend-jenkins || {
                    echo "❌ Frontend failed to start"
                    exit 1
                }
                
                echo "✅ All containers deployed successfully"
                """
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '🔍 Verifying deployment...'
                sh """
                # Wait for containers to fully start
                sleep 20
                
                echo "=== Container Status ==="
                docker ps | grep jenkins
                
                echo "=== Checking container logs ==="
                echo "Backend logs (last 5 lines):"
                docker logs --tail 5 ${BACKEND_CONTAINER_NAME} || echo "Could not get backend logs"
                
                echo "Frontend logs (last 5 lines):"
                docker logs --tail 5 ${FRONTEND_CONTAINER_NAME} || echo "Could not get frontend logs"
                
                echo "MongoDB logs (last 5 lines):"
                docker logs --tail 5 ${MONGO_CONTAINER_NAME} || echo "Could not get MongoDB logs"
                """
            }
        }
        
        stage('Test Application') {
            steps {
                echo '🧪 Testing application connectivity...'
                sh """
                # Test backend API
                echo "Testing backend API..."
                if curl -f http://${EC2_IP}:${BACKEND_PORT}/api/products; then
                    echo "✅ Backend API test passed"
                else
                    echo "❌ Backend API test failed"
                    echo "Trying localhost..."
                    curl -f http://localhost:${BACKEND_PORT}/api/products || {
                        echo "❌ Backend completely unreachable"
                        exit 1
                    }
                fi
                
                # Test frontend
                echo "Testing frontend..."
                if curl -f http://${EC2_IP}:${FRONTEND_PORT}; then
                    echo "✅ Frontend test passed"
                else
                    echo "❌ Frontend test failed"
                    echo "Trying localhost..."
                    curl -f http://localhost:${FRONTEND_PORT} || {
                        echo "❌ Frontend completely unreachable"
                        exit 1
                    }
                fi
                """
            }
        }
    }
    post {
        always {
            echo '📊 Pipeline execution completed'
            sh """
            echo "=== Final Container Status ==="
            docker ps | grep jenkins
            
            echo "=== Available URLs ==="
            echo "Manual Deployment:"
            echo "  Frontend: http://${EC2_IP}:3000"
            echo "  Backend:  http://${EC2_IP}:5000"
            echo ""
            echo "Jenkins Deployment:"
            echo "  Frontend: http://${EC2_IP}:${FRONTEND_PORT}"
            echo "  Backend:  http://${EC2_IP}:${BACKEND_PORT}"
            echo "  MongoDB:  ${EC2_IP}:${MONGO_PORT}"
            """
        }
        success {
            echo '🎉 Pipeline completed successfully!'
            echo 'Both deployments are now running:'
            echo "Manual:    http://${EC2_IP}:3000"
            echo "Jenkins:   http://${EC2_IP}:${FRONTEND_PORT}"
        }
        failure {
            echo '💥 Pipeline failed!'
            echo 'Debug information:'
            sh """
            echo "=== Failed container logs ==="
            docker logs ${BACKEND_CONTAINER_NAME} 2>&1 | tail -20 || echo "No backend logs"
            docker logs ${FRONTEND_CONTAINER_NAME} 2>&1 | tail -20 || echo "No frontend logs"
            docker logs ${MONGO_CONTAINER_NAME} 2>&1 | tail -10 || echo "No MongoDB logs"
            
            echo "=== Current containers ==="
            docker ps -a | grep jenkins
            """
        }
    }
}
