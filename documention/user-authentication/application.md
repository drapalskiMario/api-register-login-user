>## Fluxo Primário

1. [x] Obter dados do usuário e confirmação de senha (name, email, senha, confirmação de senha)
2. [x] Verificar se são dados válidos e se senha e confirmação são iguais
3. [x] Verificar se já existe usuário com o email informado
4. [x] Criar uma conta do usuário com os dados recebidos
5. [x] Retornar os dados do usuário criado

># Fluxo de Erros 1: Dados inválidos

2. [x] Se os dados são inválidos, retorna erro

># Fluxo de Erros 2: Usuário já existe

3. [x] Se usuário já existe, retorna erro