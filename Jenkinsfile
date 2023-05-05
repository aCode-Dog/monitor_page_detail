// docker集成docker部署
pipeline {
    agent {label 'master'}
    stages {
       stage('Build') {
            steps{
                echo 'This is a Build step'
                sh 'bash scripts/build.sh $branch $dev '
            }
        }
        
}}