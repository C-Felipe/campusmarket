import React, { useState } from 'react';
import styles from './Tela_Cadastro.module.css';
import api from '../api';

interface TelaCadastroProps {
  onNavigate: (nomeDaTela: string) => void;
}

export default function Tela_Cadastro({ onNavigate }: TelaCadastroProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      // Fazendo a requisição POST para o seu AuthController
      await api.post('/auth/register', { nome, telefone, email, senha }); 
      
      alert("Conta criada com sucesso no banco!");
      // Redireciona o usuário para fazer o login oficial
      onNavigate('Login'); 

    } catch (err: any) {
      // Capturando os erros customizados da sua BusinessException
      const mensagemErroCsharp = err.response?.data?.error;
      setErro(mensagemErroCsharp || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.Tela_3_5_1647} style={{ position: 'relative' }}>
      
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

      <div className={styles.Container_84_1358}>
        <div className={styles.MainContent_84_1359}>
          
          <form onSubmit={handleSubmit} className={styles.SimpleForm_84_1385}>
            <h2 className={styles.NovaConta_84_1386}>Nova Conta</h2>
            
            {/* Caixa de alerta de erro dinâmica do Back-end */}
            {erro && (
              <div style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '10px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                ⚠️ {erro}
              </div>
            )}
            
            <div className={styles.FormRow_84}>
              <div className={styles.InputLabeled_84_1388}>
                <label className={styles.Label_84} htmlFor="nome">Nome *</label>
                <input 
                  id="nome"
                  type="text"
                  className={styles.InputStandard_84}
                  placeholder="Informe seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={carregando}
                  required
                />
              </div>
            </div>

            <div className={styles.FormRow_84}>
              <div className={styles.InputLabeled_84_1388}>
                <label className={styles.Label_84} htmlFor="telefone">Telefone *</label>
                <input 
                  id="telefone"
                  type="tel"
                  className={styles.InputStandard_84}
                  placeholder="Informe seu telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  disabled={carregando}
                  required
                />
              </div>
            </div>

            <div className={styles.FormRow_84}>
              <div className={styles.InputLabeled_84_1388}>
                <label className={styles.Label_84} htmlFor="email">Email *</label>
                <input 
                  id="email"
                  type="email"
                  className={styles.InputStandard_84}
                  placeholder="Informe seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={carregando}
                  required
                />
              </div>
            </div>

            <div className={styles.FormRow_84}>
              <div className={styles.InputLabeled_84_1388}>
                <label className={styles.Label_84} htmlFor="senha">Senha *</label>
                <div className={styles.PasswordInputWrapper}>
                  <input 
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    className={styles.InputStandard_Password}
                    placeholder="Informe sua senha"
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
            </div>

            <div className={styles.SubmitButton_84_1407}>
              <button 
                type="submit" 
                className={styles.ButtonFilledStandard_84_1408}
                disabled={carregando}
              >
                <span className={styles.CreateAccount_84_1409}>
                  {carregando ? "Criando conta..." : "Criar conta"}
                </span>
              </button>

              <button 
                type="button" 
                className={styles.ButtonBackToLogin}
                onClick={() => onNavigate('Login')}
                disabled={carregando}
              >
                Já tem conta? Entrar
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}