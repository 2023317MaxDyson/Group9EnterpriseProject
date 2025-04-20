pipeline {
    agent any

environment{
    AWS_DOCKER_RESGISTRY = '050071414437.dkr.ecr.ca-central-1.amazonaws.com'
    APP_NAME = 'my_new_image'
    AWS_DEFAULT_REGION = 'ca-central-1'
}

    stages {
        stage('Build') {

            environment{
                CI = 'false'
            }

            agent {
                docker {
                    image 'node:20.11.0-bullseye'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm install 
                    npm run build
                    ls -la
                '''
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'node:20.11.0-bullseye'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    test -f build/index.html
                    npm test App.test.js
                '''
            }
        }

        stage('Build My Docker Image'){
       
        agent{
            docker{
              image 'amazon/aws-cli'
              reuseNode true
              args '-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
            }
        }
        steps{
        withCredentials([usernamePassword(credentialsId: 'myNewUser', passwordVariable: 'AWS=SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {

         sh '''
            amazon-linux-extras install docker
            docker build -t $AWS_DOCKER_REGISTRY/$APP_NAME . 
            aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_DOCKER_REGISTRY
            docker push $AWS_DOCKER_REGISTRY/$APP_NAME:latest
         '''
         }

        }

        }

        stage('Deploy to AWS'){

        agent{
            docker{
                image 'amazon/aws-cli'
                reuseNode true
                args '-u root --entrypoint=""'
            }
        }
         
          steps{
            withCredentials([usernamePassword(credentialsId: 'myNewUser', passwordVariable: 'AWS=SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID' )]) {

            sh'''
            aws --version
            yum install jq -y
            LATEST_TD_REVSION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition.json | jq '.taskDefinition.revision')
            aws ecs update-service --cluster my-enterprise-project-Cluster_Prod --service my-enterprise-project-Service-Prod --task definition MyNewReactApp-TaskDefinition-Prod:$LATEST_TD_REVSION
            '''
            }

          }

        }
    }
}