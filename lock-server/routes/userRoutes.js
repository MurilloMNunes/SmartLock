const express = require('express');
const User = require('../models/User');
const router = express.Router();
// CADASTRO
router.post('/', async (req, res) => {

  console.log(req.body);
  try {
      const { nome, email, senha } = req.body; // Dados do corpo da requisição
      const newUser = new User({ nome, email, senha }); // Crie um novo usuário
      // Salve o usuário no banco de dados
      await newUser.save();

      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Procurar todos os usuários
router.get('/', async (req, res) => {
  const users = await User.find();
  return res.send({ users });
});


// Alterar usuário
router.put('/:email', async (req, res) => {
  try {
      const { email } = req.params; // Obtém o email do parâmetro da rota
      const atualizacao = req.body; // Obtém os dados a serem atualizados do corpo da requisição

      // Atualize o usuário pelo email
      const user = await User.findOneAndUpdate({ email }, atualizacao, { new: true });

      if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({ user });
  } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});


// Excluir usuário
router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  return res.send({ user });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Encontrar usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Comparar a senha fornecida com a senha hash armazenada
    if(senha === user.senha) { isMatch = true;}
    else { isMatch = false;}
    //const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }
    console.log('Login bem-sucedido!');
    res.json({ message: 'Login bem-sucedido', user });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

module.exports = router;
