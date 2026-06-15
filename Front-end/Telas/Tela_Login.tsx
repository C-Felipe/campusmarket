import React, { useState } from 'react';
import styles from './Tela_Login.module.css';
import api from '../api';

interface TelaLoginProps {
  onNavigate: (nomeDaTela: string) => void;
}

export default function Tela_Login({ onNavigate }: TelaLoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const resposta = await api.post('/auth/login', { email, senha });
      
      localStorage.setItem('token', resposta.data.token);

      onNavigate('Inicial');
      
    } catch (err: any) {
      const mensagemErroCsharp = err.response?.data?.error;
      
      setErro(mensagemErroCsharp || "Não foi possível conectar ao servidor. Verifique se a API está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.LoginContainer} style={{ position: 'relative' }}>
      
      {/* Cabeçalho discreto estilo grandes portais no cantinho superior */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent'
      }}>
        <div 
          onClick={() => onNavigate('Inicial')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'var(--cor-primaria)',
            fontFamily: '"Baloo 2", sans-serif',
            fontSize: '22px',
            fontWeight: 'bold'
          }}
          title="Voltar para a página inicial"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          CampusMarket
        </div>
      </header>

      {/* O cartão de login continua igual aqui embaixo */}
      <div className={styles.LoginCard}>
        
        <h1 className={styles.Titulo}>Bem-vindo à CampusMarket</h1>
        <p className={styles.Subtitulo}>Faça login para começar a comprar</p>

        {/* Caixa de alerta de erro crítico */}
        {erro && (
          <div style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '15px', fontFamily: 'sans-serif', fontWeight: 'bold', textAlign: 'center' }}>
            ⚠️ {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className={styles.Formulario}>
          
          <div className={styles.InputGroup}>
            <label className={styles.Label} htmlFor="login-email">E-mail *</label>
            <input
              id="login-email"
              type="email"
              className={styles.InputStandard}
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
              required
            />
          </div>

          <div className={styles.InputGroup}>
            <label className={styles.Label} htmlFor="login-senha">Senha *</label>
            <div className={styles.PasswordWrapper}>
              <input
                id="login-senha"
                type={mostrarSenha ? "text" : "password"}
                className={styles.InputPassword}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                required
              />
              <button
                type="button"
                className={styles.EyeButton}
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                disabled={carregando}
              >
                {mostrarSenha ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.ButtonEntrar}
            disabled={carregando}
          >
            {carregando ? "Autenticando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.DivisorContainer}>
          <div className={styles.Linha}></div>
          <span className={styles.TextoDivisor}>Não tem uma conta?</span>
          <div className={styles.Linha}></div>
        </div>

        <button 
          type="button" 
          className={styles.ButtonCriarConta}
          onClick={() => onNavigate('Cadastro')}
          disabled={carregando}
        >
          Crie sua conta nova
        </button>

      </div>
    </div>
  );
}