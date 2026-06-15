import React, { useState, useEffect } from 'react';
import styles from './Tela_Produto.module.css';
import api from '../api';

interface TelaProdutoProps {
  onNavigate: (tela: string) => void;
  produtoId?: number;
}

interface DetalheProdutoBackend {
  id: number;
  title: string;
  price: number;
  description: string;
  materialSpec?: string;
  imagemUrlMain?: string;
  imagemUrlThumb?: string;
  telefoneVendedor: string;
}

export default function Tela_Produto({ onNavigate, produtoId }: TelaProdutoProps) {
  const [produto, setProduto] = useState<DetalheProdutoBackend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function obterDadosDoProduto() {
      if (!produtoId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/anuncios/${produtoId}`);
        const dadosBackend = response.data;

        const urlImagem = dadosBackend.imagemUrl 
          ? `${api.defaults.baseURL?.replace('/api', '')}${dadosBackend.imagemUrl}` 
          : undefined;

        setProduto({
          id: dadosBackend.id,
          title: dadosBackend.titulo,
          price: dadosBackend.preco,
          description: dadosBackend.descricao,
          telefoneVendedor: dadosBackend.telefoneVendedor,
          imagemUrlMain: urlImagem,
          imagemUrlThumb: urlImagem 
        });

      } catch (error) {
        console.error("Erro ao carregar detalhes do anúncio:", error);
      } finally {
        setLoading(false);
      }
    }

    obterDadosDoProduto();
  }, [produtoId]);

  const handleWhatsAppRedirect = () => {
    if (!produto || !produto.telefoneVendedor) return;

    const numeroTelefone = produto.telefoneVendedor.replace(/\D/g, '');
    const mensagem = encodeURIComponent(`Olá! Vi seu anúncio de "${produto.title}" no CampusMarket e tenho interesse.`);
    
    // Monta o link mágico do Zap
    const urlWhatsapp = `https://wa.me/55${numeroTelefone}?text=${mensagem}`;
    
    window.open(urlWhatsapp, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--cor-texto-dark)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: 'var(--bg-popeye)' }}>
        <h3>Carregando detalhes do anúncio...</h3>
      </div>
    );
  }

  if (!produto) {
    return (
      <div style={{ color: 'var(--cor-texto-dark)', textAlign: 'center', padding: '50px', fontFamily: 'sans-serif', backgroundColor: 'var(--bg-popeye)', height: '100vh' }}>
        <h3>Anúncio não encontrado ou já finalizado.</h3>
        <button onClick={() => onNavigate('Inicial')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: 'var(--cor-primaria)', color: '#fff', border: 'none', borderRadius: '5px' }}>Voltar ao Início</button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Goldman&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />

      <header className={styles.navbar}>
        <div 
          className={styles.logo} 
          onClick={() => onNavigate('Inicial')} 
          style={{ cursor: 'pointer' }}
        >
          CampusMarket
        </div>
        
        <div className={styles.navIcons}>
          <button 
            className={styles.iconButtonInvisible} 
            aria-label="Perfil do usuário"
            onClick={() => onNavigate('Perfil')}
            style={{ cursor: 'pointer' }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--cor-texto-dark)" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
            </svg>
          </button>
        </div>
        <div className={styles.dividerLinha}>
          <svg width="100%" height="1" viewBox="0 0 1536 1" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0H1536" stroke="var(--border-input)" />
          </svg>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <main className={styles.mainGrid}>
          
          <div className={styles.leftColumn}>
            <div className={styles.imageSection}>
              <div 
                className={styles.imagePlaceholderMain}
                style={{
                  backgroundImage: produto.imagemUrlMain ? `url(${produto.imagemUrlMain})` : undefined,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundColor: produto.imagemUrlMain ? 'transparent' : '#e2e8f0'
                }}
              >
                {!produto.imagemUrlMain && <span style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b'}}>Sem Imagem</span>}
              </div>
              
              {/* Se você tivesse fotos extras, elas apareceriam aqui embaixo */}
              {/* <div className={styles.thumbnailColumn}> ... </div> */}
            </div>
          </div>

          <aside className={styles.sidebarCard}>
            <h1 className={styles.productName}>{produto.title}</h1>
            <div className={styles.productPrice}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.price)}
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.btnPrimary} onClick={handleWhatsAppRedirect}>
                Chamar no WhatsApp
              </button>
            </div>

            <div className={styles.descriptionBox}>
              <h3>Descrição do Produto</h3>
              <p>{produto.description}</p>
            </div>
          </aside>
        </main>

        <div className={styles.containerGeralRodape}>
          <hr className={styles.divisorRodape} />
          <footer style={{ 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    width: '100%',
    padding: '20px 0'
  }}>
    {/* Marca na esquerda */}
    <div style={{ fontSize: '14px', color: 'var(--cor-texto-dark, #64748b)', fontWeight: '600' }}>
      © {new Date().getFullYear()} CampusMarket. Todos os direitos reservados.
    </div>

    {/* Suporte na direita */}
    <a href="#suporte" style={{ 
      color: 'var(--cor-primaria, #3b82f6)', 
      textDecoration: 'none', 
      fontWeight: '600' 
    }}>
      Suporte
    </a>
  </footer>
        </div>
      </div> 
    </div>
  );
}