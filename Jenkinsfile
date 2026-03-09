pipeline {
    agent any
    
    stages {
        stage('Setup Tools') {
            steps {
                sh '''
                    echo "=== Устанавливаем Node.js ==="
                    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                    apt-get update && apt-get install -y nodejs
                    
                    echo "=== Проверяем Node.js ==="
                    node --version
                    npm --version
                    
                    echo "=== Устанавливаем k6 ==="
                    curl -L -o /tmp/k6.tar.gz https://github.com/grafana/k6/releases/download/v0.49.0/k6-v0.49.0-linux-amd64.tar.gz
                    tar -xzf /tmp/k6.tar.gz -C /tmp
                    mv /tmp/k6-v0.49.0-linux-amd64/k6 /usr/local/bin/
                    rm -rf /tmp/k6*
                    chmod +x /usr/local/bin/k6
                    
                    echo "=== Проверяем k6 ==="
                    k6 version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Start API') {
            steps {
                sh '''
                    node server.js &
                    echo $! > api.pid
                    sleep 5
                '''
            }
        }
        
        stage('Run Smoke Test') {
            steps {
                sh 'k6 run k6-tests/scripts/smoke-test.js'
            }
        }
        
        stage('Run CRUD Test') {
            steps {
                sh 'k6 run --summary-export=results.json k6-tests/scripts/crud-test.js'
            }
        }
        
        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'results.json', allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            sh '''
                if [ -f api.pid ]; then
                    kill $(cat api.pid) || true
                    rm api.pid
                fi
            '''
        }
        failure {
            echo '❌ Тесты провалились!'
        }
        success {
            echo '✅ Все тесты пройдены!'
        }
    }
}