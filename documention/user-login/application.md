>## Fluxo Primário

1. [x] Obter dados do usuário (email, senha)
2. [x] Verificar se são dados válidos
3. [x] Verificar se existe usuário com email informado
4. [x] Verificar se senha informada está de acordo com senha salva no banco
5. [x] Gerar token e salvar no banco
6. [x] Retorna token gerado

># Fluxo de Erros 1: Dados inválidos

2. [x] Se os dados são inválidos, retorna erro

># Fluxo de Erros 2: Usuário já existe

3. [x] Se usuário não existe, retorna erro

># Fluxo de Erros 3: Senha incorreta

3. [x] Se senha informada está incorreta, retorna erro