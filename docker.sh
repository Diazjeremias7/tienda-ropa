#!/bin/bash
# Script de utilidades para la tienda de ropa

case "$1" in
  start)
    echo "🚀 Iniciando contenedores..."
    docker-compose up -d
    echo "✅ Contenedores iniciados"
    echo ""
    echo "📍 URLs disponibles:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo "   MySQL:    localhost:3306"
    ;;
  
  stop)
    echo "⏸️  Deteniendo contenedores..."
    docker-compose down
    echo "✅ Contenedores detenidos"
    ;;
  
  restart)
    echo "🔄 Reiniciando contenedores..."
    docker-compose restart
    echo "✅ Contenedores reiniciados"
    ;;
  
  logs)
    if [ -z "$2" ]; then
      docker-compose logs -f
    else
      docker-compose logs -f "$2"
    fi
    ;;
  
  status)
    echo "📊 Estado de los contenedores:"
    docker-compose ps
    ;;
  
  build)
    echo "🔨 Reconstruyendo imágenes..."
    docker-compose build --no-cache
    echo "✅ Imágenes reconstruidas"
    ;;
  
  clean)
    echo "🧹 Limpiando contenedores y volúmenes..."
    docker-compose down -v
    echo "✅ Limpieza completa"
    ;;
  
  db)
    echo "💾 Conectando a la base de datos..."
    docker exec -it tienda_mysql mysql -u tienda_user -ptienda_pass tienda_ropa
    ;;
  
  test)
    echo "🧪 Probando la API..."
    echo ""
    echo "1. Test de health check:"
    curl -s http://localhost:3001/ | grep -q "funcionando" && echo "✅ Backend respondiendo" || echo "❌ Backend no responde"
    echo ""
    echo "2. Test de login:"
    response=$(curl -s -X POST http://localhost:3001/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@tienda.com","password":"admin123"}')
    echo "$response" | grep -q "token" && echo "✅ Login funcionando" || echo "❌ Login falló"
    echo ""
    echo "3. Test de productos:"
    curl -s http://localhost:3001/api/productos | grep -q "Remera" && echo "✅ API de productos funcionando" || echo "❌ API de productos falló"
    ;;
  
  *)
    echo "🛍️  Tienda de Ropa - Utilidades Docker"
    echo ""
    echo "Uso: ./docker.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start    - Iniciar todos los contenedores"
    echo "  stop     - Detener todos los contenedores"
    echo "  restart  - Reiniciar todos los contenedores"
    echo "  logs     - Ver logs (opcional: especificar servicio)"
    echo "  status   - Ver estado de los contenedores"
    echo "  build    - Reconstruir imágenes desde cero"
    echo "  clean    - Detener y eliminar todo (incluye base de datos)"
    echo "  db       - Conectar a la base de datos MySQL"
    echo "  test     - Ejecutar pruebas de la API"
    echo ""
    echo "Ejemplos:"
    echo "  ./docker.sh start"
    echo "  ./docker.sh logs backend"
    echo "  ./docker.sh db"
    ;;
esac
