import React, { useState, useEffect } from 'react';
import styles from './Tela_PerfilConfig.module.css';
import api from '../api';

interface TelaPerfilConfigProps {
  onNavigate: (tela: string) => void;
  temaEscuro: boolean;
  setTemaEscuro: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Tela_PerfilConfig({ onNavigate, temaEscuro, setTemaEscuro }: TelaPerfilConfigProps) {

  const [notificacoes, setNotificacoes] = useState(false);

  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState(''); 
  const [email, setEmail] = useState('carregando...');

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  useEffect(() => {
    async function carregarInformacoesIniciais() {
      try {
        setCarregando(true);
        const response = await api.get('/usuarios/me');
        const dados = response.data;
        
        setNome(dados.nome);
        setTelefone(dados.telefone);
        setEmail(dados.email);

        setUsername(dados.nome.split(' ')[0]);
        
      } catch (error) {
        console.error("Erro ao puxar dados cadastrais:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarInformacoesIniciais();
  }, []);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagemSucesso('');

    const telefoneLimpo = telefone.replace(/\D/g, '');

    try {
      await api.put('/usuarios/perfil', { 
        nome: nome, 
        telefone: telefoneLimpo 
      }); 
      
      setMensagemSucesso('Configurações atualizadas com sucesso.');
      setTimeout(() => setMensagemSucesso(''), 4000);
    } catch (err: any) {
      const mensagemErro = err.response?.data?.error;
      alert(mensagemErro || 'Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    if (window.confirm('Deseja descartar as alterações?')) {
      onNavigate('Perfil');
    }
  };

  return (
    <div className={styles.Tela_4_12_1175}>
      
      <header className={styles.Barra_12_1253}>
        <div 
          className={styles.Logo_1_2491} 
          onClick={() => onNavigate('Inicial')} 
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.CampusBazaar_1_2492}>CampusMarket</span>
        </div>

        <div className={styles.Icons_1_2493}>
          <button 
            className={styles.IconButtonInvisible} 
            aria-label="Perfil do usuário"
            onClick={() => onNavigate('Perfil')}
            style={{ cursor: 'pointer' }}
            disabled={salvando || carregando}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--cor-texto-dark)' }}>
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className={styles.Divider_Linha}>
          <svg width="100%" height="1" viewBox="0 0 1536 1" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0H1536" stroke="var(--cor-primaria)" />
          </svg>
        </div>
      </header>

      <main className={styles.Container_12_1277}>
        <div className={styles.MainContent_12_1185}>
          <div className={styles.AppSettings_12_1186}>
            <h1 className={styles.ConfiguraçõesDoSite_12_1187}>Configurações do Site</h1>
            
            {mensagemSucesso && (
              <div style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '12px', borderRadius: '6px', textAlign: 'center', marginBottom: '20px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                {mensagemSucesso}
              </div>
            )}

            {carregando ? (
              <div style={{ color: 'var(--cor-texto-dark)', textAlign: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
                Puxando suas informações do banco de dados...
              </div>
            ) : (
              <>
                <div className={styles.EditableUsername_12_1188}>
                  <div className={styles.Profile_12_1189}>
                    <div className={styles.AvatarPlaceholder}>
                      <span className={styles.AvatarFallbackText}>
                        {username ? username.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <button type="button" className={styles.IconButtonOutlinedStandard_12_1191} aria-label="Editar foto de perfil">
                      <div className={styles.Div_12_1192}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 3.00006C17.2626 2.73741 17.5744 2.52907 17.9176 2.38693C18.2608 2.24479 18.6286 2.17163 19 2.17163C19.3714 2.17163 19.7392 2.24479 20.0824 2.38693C20.4256 2.52907 20.7374 2.73741 21 3.00006C21.2626 3.2627 21.471 3.57451 21.6131 3.91767C21.7553 4.26083 21.8284 4.62862 21.8284 5.00006C21.8284 5.37149 21.7553 5.73929 21.6131 6.08245C21.471 6.42561 21.2626 6.73741 21 7.00006L7.5 20.5001L2 22.0001L3.5 16.5001L17 3.00006Z" stroke="var(--cor-texto-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className={styles.InputLabeled_12_1195}>
                    <label className={styles.NomeDeUsuário_12_1196} htmlFor="username">Nome de Usuário (Apelido)</label>
                    <div className={styles.InputStandard_12_1197}>
                      <input 
                        id="username"
                        type="text" 
                        className={styles.FormInputStyle}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={salvando}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.ToggleableSettingsList_12_1199}>
                  <h2 className={styles.Preferências_12_1200}>Preferências Locais</h2>
                  
                  <div className={styles.ToggleableSetting_12_1201} onClick={() => !salvando && setNotificacoes(!notificacoes)}>
                    <div className={styles.Container_12_1202}>
                      <span className={styles.Notificações_12_1203}>Notificações</span>
                      <span className={styles.AtivarNotificaçõesPorEmail_12_1204}>Ativar notificações no navegador</span>
                    </div>
                    <div className={`${styles.ToggleTrack} ${notificacoes ? styles.ToggleTrackActive : ''}`}>
                      <div className={`${styles.ToggleHandle} ${notificacoes ? styles.ToggleHandleActive : ''}`} />
                    </div>
                  </div>

                  <div className={styles.ToggleableSetting_12_1207} onClick={() => !salvando && setTemaEscuro(!temaEscuro)}>
                    <div className={styles.Container_12_1208}>
                      <span className={styles.TemaEscuro_12_1209}>Tema Escuro</span>
                      <span className={styles.AtivarTemaEscuroNoSite_12_1210}>Alternar cores da interface</span>
                    </div>
                    <div className={`${styles.ToggleTrack} ${temaEscuro ? styles.ToggleTrackActive : ''}`}>
                      <div className={`${styles.ToggleHandle} ${temaEscuro ? styles.ToggleHandleActive : ''}`} />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSalvar} className={styles.SettingsInputList_12_1225}>
                  <h2 className={styles.InformaçõesPessoais_12_1226}>Informações Pessoais</h2>
                  
                  <div className={styles.FormRow_12_1227}>
                    <div className={styles.InputLabeled_12_1228}>
                      <label className={styles.Nome_12_1229} htmlFor="nome">Nome Completo</label>
                      <div className={styles.InputStandard_12_1230}>
                        <input 
                          id="nome"
                          type="text" 
                          placeholder="Digite seu nome"
                          className={styles.FormInputStyle}
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          disabled={salvando}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.FormRow_Telefone}>
                    <div className={styles.InputLabeled_Telefone}>
                      <label className={styles.TelefoneLabel} htmlFor="telefone">Telefone / WhatsApp (Apenas números)</label>
                      <div className={styles.InputStandard_Telefone}>
                        <input 
                          id="telefone"
                          type="tel" 
                          placeholder="Ex: 11999999999"
                          className={styles.FormInputStyle}
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          disabled={salvando}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.FormRow_12_1236}>
                    <div className={styles.InputLabeled_12_1237}>
                      <label className={styles.Email_12_1238} htmlFor="email">E-mail Cadastrado</label>
                      <div className={`${styles.InputStandard_12_1239} ${styles.InputDisabled}`}>
                        <input 
                          id="email"
                          type="email" 
                          className={styles.FormInputStyle}
                          value={email}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.SettingsInputList_12_1246}>
                    <button 
                      type="submit" 
                      className={styles.ButtonOutlinedStandard_12_1247}
                      disabled={salvando}
                    >
                      <span className={styles.SalvarAlterações_12_1248}>
                        {salvando ? "Salvando..." : "Salvar Alterações"}
                      </span>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCancelar} 
                      className={styles.ButtonOutlinedStandard_12_1249}
                      disabled={salvando}
                    >
                      <span className={styles.Cancelar_12_1250}>Cancelar</span>
                    </button>
                  </div>
                </form>

              </>
            )}

          </div>
        </div>
      </main>
      <footer className={styles.BasicFooter_12_1251}></footer>
    </div>
  );
}