pipeline {
    agent any
    
    environment {
        BASE_URL = 'http://localhost:3000'
        // Каталог внутри контейнера Jenkins
        WORKSPACE = "${env.WORKSPACE}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                sh '''
                    # Проверяем наличие node
                    if ! command -v node &> /dev/null; then
                        # Для Debian/Ubuntu (в контейнере Jenkins)
                        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                        apt-get update && apt-get install -y nodejs
                    fi
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
                    # Запускаем API в фоне
                    node server.js &
                    echo $! > api.pid
                    # Ждём готовности
                    sleep 5
                '''
            }
        }
        
        stage('Install k6') {
            steps {
                sh '''
                    # Установка k6 без sudo
                    apt-get update
                    apt-get install -y dirmngr
                    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
                    echo "deb https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list
                    apt-get update
                    apt-get install -y k6
                '''
            }
        }
        
        stage('Smoke Test') {
            steps {
                sh 'k6 run k6-tests/scripts/smoke-test.js'
            }
        }
        
        stage('CRUD Performance Test') {
            steps {
                sh '''
                    k6 run \
                        --summary-export=results.json \
                        k6-tests/scripts/crud-test.js
                '''
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
                # Останавливаем API
                if [ -f api.pid ]; then
                    kill $(cat api.pid) || true
                    rm api.pid
                fi
            '''
        }
        failure {
            echo '❌ Performance thresholds failed!'
        }
        success {
            echo '✅ All tests passed!'
        }
    }
}