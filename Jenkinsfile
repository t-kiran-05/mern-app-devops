pipeline {
    agent any
    
    environment {
        EC2_IP = '34.228.112.56'
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
                # Stop and remove ONLY Jenkins containers
                docker stop ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                sleep 5
                docker rm ${BACKEND_CONTAINER_NAME} ${FRONTEND_CONTAINER_NAME} ${MONGO_CONTAINER_NAME} || true
                
                # Clean up old images
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
        
        stage('Verify Deployment') {
            steps {
                echo '🔍 Verifying deployment...'
                sh """
                # Wait for everything to start
                sleep 20
                
                echo "=== Container Status ==="
                docker ps | grep jenkins
                
                # Test backend
                echo "Testing backend..."
                curl -f http://${EC2_IP}:${BACKEND_PORT}/api/products && echo "✅ Backend working"
                
                # Test frontend
                echo "Testing frontend..."
                curl -f http://${EC2_IP}:${FRONTEND_PORT} && echo "✅ Frontend working"
                """
            }
        }

        stage('Checkout Test Code') {
            steps {
                echo '📥 Checking out test code...'
                dir('test-repo') {
                    git branch: 'main', url: 'https://github.com/t-kiran-05/mern-automation-tests.git'
                }
            }
        }

        stage('Run Selenium Tests') {
            agent {
                docker {
                    image 'markhobson/maven-chrome'
                    args '-u root:root -v /var/lib/jenkins/.m2:/root/.m2'
                    reuseNode true
                }
            }
            steps {
                echo '🧪 Running Selenium Automation Tests...'
                dir('test-repo') {
                    sh """
                    # Update the base URL in test configuration
                    echo "Testing against: http://${EC2_IP}:${FRONTEND_PORT}"
                    
                    # Run Maven tests
                    mvn clean test -Dtest.url=http://${EC2_IP}:${FRONTEND_PORT}
                    """
                }
            }
        }

        stage('Publish Test Results') {
            steps {
                echo '📊 Publishing test results...'
                junit 'test-repo/target/surefire-reports/*.xml'
            }
        }
    }
    
    post {
        always {
            echo '📧 Sending test results email...'
            script {
                try {
                    // Get commit author email
                    sh "git config --global --add safe.directory ${env.WORKSPACE}"
                    def committer = sh(
                        script: "git log -1 --pretty=format:'%ae'",
                        returnStdout: true
                    ).trim()

                    // Parse test results
                    def raw = sh(
                        script: "grep -h \"<testcase\" test-repo/target/surefire-reports/*.xml 2>/dev/null || echo ''",
                        returnStdout: true
                    ).trim()

                    int total = 0
                    int passed = 0
                    int failed = 0
                    int skipped = 0
                    def details = ""

                    if (raw != "") {
                        raw.split('\n').each { line ->
                            if (line.contains("<testcase")) {
                                total++
                                def nameMatcher = (line =~ /name=\"([^\"]+)\"/)
                                def name = nameMatcher ? nameMatcher[0][1] : "Unknown Test"
                                
                                if (line.contains("<failure")) {
                                    failed++
                                    details += "❌ ${name} — FAILED\n"
                                } else if (line.contains("<skipped") || line.contains("</skipped>")) {
                                    skipped++
                                    details += "⏭️  ${name} — SKIPPED\n"
                                } else {
                                    passed++
                                    details += "✅ ${name} — PASSED\n"
                                }
                            }
                        }
                    }

                    def testStatus = total > 0 && failed == 0 ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"

                    def emailBody = """
╔════════════════════════════════════════════════════════╗
║   MERN E-Commerce - Automated Test Results            ║
║   Build #${env.BUILD_NUMBER}                                     ║
╚════════════════════════════════════════════════════════╝

${testStatus}

📊 TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tests:   ${total}
✅ Passed:     ${passed}
❌ Failed:     ${failed}
⏭️  Skipped:    ${skipped}
Success Rate:  ${total > 0 ? String.format("%.1f", (passed * 100.0 / total)) : "0"}%

🔗 BUILD INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Jenkins Build: ${env.BUILD_URL}
Build Status:  ${currentBuild.result ?: 'IN PROGRESS'}

📋 DETAILED TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${details ?: 'No test results available. Tests may not have run.'}

🚀 DEPLOYMENT URLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Frontend:    http://${EC2_IP}:${FRONTEND_PORT}
🔌 Backend API: http://${EC2_IP}:${BACKEND_PORT}/api/products
📦 Environment: Production (Jenkins CI/CD)

✏️  COMMIT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Committer: ${committer}
"""
                    
                    sh "git log -1 --format='Commit: %H%nAuthor: %an%nDate: %ad%nMessage: %s' >> /tmp/commit_info.txt 2>/dev/null || true"
                    def commitInfo = sh(script: "cat /tmp/commit_info.txt 2>/dev/null || echo 'No commit info'", returnStdout: true).trim()
                    
                    emailBody += "\n${commitInfo}\n"
                    emailBody += """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is an automated message from Jenkins CI/CD Pipeline.
"""

                    emailext(
                        to: committer,
                        subject: "🧪 Build #${env.BUILD_NUMBER} - Test Results [${testStatus}]",
                        body: emailBody,
                        mimeType: 'text/plain'
                    )
                    
                    echo "✅ Email sent to: ${committer}"
                } catch (Exception e) {
                    echo "⚠️ Could not send email: ${e.message}"
                }
            }
        }
        success {
            echo '🎉 BUILD & DEPLOYMENT SUCCESSFUL!'
            sh """
            echo "╔════════════════════════════════════════╗"
            echo "║     Deployment Successful! ✅          ║"
            echo "╚════════════════════════════════════════╝"
            echo ""
            echo "🌐 Frontend: http://${EC2_IP}:${FRONTEND_PORT}"
            echo "🔌 Backend:  http://${EC2_IP}:${BACKEND_PORT}"
            echo ""
            echo "Latest commit:"
            git log -1 --oneline
            """
        }
        failure {
            echo '❌ BUILD, DEPLOYMENT, OR TESTS FAILED!'
            echo 'Check the logs above for details.'
        }
    }
}