pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code from Git...'
                git branch: 'main', url: 'https://github.com/t-kiran-05/mern-app-devops.git'
            }
        }
        
        stage('Build and Deploy') {
            steps {
                echo '🐳 Building and deploying with Docker Compose...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
        
        stage('Test Application') {
            steps {
                echo '🧪 Testing application connectivity...'
                sh 'sleep 15'  // Wait for containers to start
                sh 'curl -f http://localhost:3000 || exit 1'
                sh 'curl -f http://localhost:5000 || exit 1'
            }
        }
    }
    post {
        always {
            echo '📊 Pipeline completed. Checking container status:'
            sh 'docker ps'
        }
        success {
            echo '✅ Pipeline completed successfully!'
            emailext (
                subject: "✅ Pipeline SUCCESS: ${env.JOB_NAME}",
                body: "The Jenkins pipeline ${env.BUILD_URL} completed successfully.",
                to: "admin@example.com"
            )
        }
        failure {
            echo '❌ Pipeline failed!'
            emailext (
                subject: "❌ Pipeline FAILED: ${env.JOB_NAME}",
                body: "The Jenkins pipeline ${env.BUILD_URL} failed. Please check: ${env.BUILD_URL}",
                to: "admin@example.com"
            )
        }
    }
}
