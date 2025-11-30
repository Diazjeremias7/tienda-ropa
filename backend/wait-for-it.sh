#!/bin/sh
# wait-for-it.sh - Script para esperar a que MySQL esté listo

set -e

host="$1"
shift
cmd="$@"

echo "⏳ Esperando a que MySQL esté disponible en $host..."

until nc -z -v -w30 $host 3306
do
  echo "MySQL no está listo - esperando..."
  sleep 2
done

echo "✅ MySQL está listo - ejecutando comando"
exec $cmd
