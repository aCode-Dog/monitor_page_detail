// docker集成docker部署
pipeline {
    agent {label 'master'}
    stages {
       stage('Build') {
            steps{
                echo 'This is a Build step'
                // 在有Jenkinsfile同一个目录下（项目的根目录下）
                sh 'bash scripts/build.sh'
            }
        }
        
}}