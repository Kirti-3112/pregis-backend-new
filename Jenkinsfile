pipeline {
    agent { label 'docker' }
    environment {
        SONARQUBE_URL = 'http://172.20.3.44:9000/'  // URL of your SonarQube server
        SONARQUBE_TOKEN = 'sqa_f347831ab3b77d7be347e561aabd96d3a57f40a8' // Token for SonarQube analysis
    }
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/pregis_dev_backend']], userRemoteConfigs: [[credentialsId: 'gitlab-credentials-id', url: 'http://Amar.Powar:nkzMffq_RoEnT72AF9Gn@git.intelliswift.com/Pregis/pregis-backend.git']]])
            }
        }

            stage('Build and Test') {
                steps {
                    sh 'npm install' // Adjust based on your build process
                    sh 'cp .env.example .env'
                    sh 'npm test'
                }
            }
            // stage('SonarQube Analysis') {
            // steps {
            //     script {
            //         // Run Sonar Scanner analysis
            //         sh 'npm run coverage'
            //       //  sh 'npm run sonar'
            //     }
            // }
            // }
            stage('Docker Build') {
                steps {
                    script {
                        sh '''
                        npm run docker:dev

                        '''
                    }
                }
            }
    }

    post {
        success {
            echo 'Build successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
