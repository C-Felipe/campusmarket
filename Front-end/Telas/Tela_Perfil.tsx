import React, { useState, useEffect } from 'react';
import styles from './Tela_Perfil.module.css';
import api from '../api';

interface TelaPerfilProps {
  onNavigate: (tela: string) => void;
}

interface ProdutoPerfilBackend {
  id: number;
  title: string;
  price: number;
  imagemUrl?: string;
}

interface DadosUsuario {
  nome: string;
  verificado: boolean;
}

export default function Tela_Perfil({ onNavigate }: TelaPerfilProps) {
  if (!localStorage.getItem('token')) {
    onNavigate('Login');
    return null; 
  }

  const [busca, setBusca] = useState('');
  
  const [usuario, setUsuario] = useState<DadosUsuario>({ nome: 'Carregando...', verificado: false });
  const [meusProdutos, setMeusProdutos] = useState<ProdutoPerfilBackend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDadosPerfil() {
      try {
        setLoading(true);

        const [respostaUsuario, respostaAnuncios] = await Promise.all([
          api.get('/usuarios/me'),
          api.get('/usuarios/meus-anuncios')
        ]);
        console.log("Dados dos meus anúncios:", respostaAnuncios.data);

        setUsuario({ nome: respostaUsuario.data.nome, verificado: true });

        const produtosMapeados = respostaAnuncios.data.map((item: any) => ({
          id: item.id,
          title: item.titulo,
          price: item.preco,
          imagemUrl: item.imagemUrl 
            ? `${api.defaults.baseURL?.replace('/api', '')}${item.imagemUrl}` 
            : undefined
        }));

        setMeusProdutos(produtosMapeados);
      } catch (error) {
        console.error("Erro ao sincronizar dados de perfil:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosPerfil();
  }, []);

  const handleDeletarProduto = async (e: React.MouseEvent, idProduto: number) => {
    e.stopPropagation(); 
    
    const confirmar = window.confirm("Tem certeza que deseja apagar este anúncio?");
    if (!confirmar) return;

    try {
      await api.delete(`/anuncios/${idProduto}`);
      
      setMeusProdutos(prev => prev.filter(p => p.id !== idProduto));
      alert("Anúncio apagado com sucesso.");
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao apagar anúncio.");
    }
  };

  const produtosFiltrados = meusProdutos.filter(produto =>
    produto.title.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className={styles.container}>
      
      <header className={styles.header}>
        <div className={styles.Barra_1_2833}>
          <div className={styles.Logo_1_2491} onClick={() => onNavigate('Inicial')} style={{ cursor: 'pointer' }}>
            <span className={styles.CampusBazaar_1_2492}>CampusMarket</span>
          </div>
          
          <div className={styles.Icons_1_2493}>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                onNavigate('Login');
              }}
              style={{
                backgroundColor: 'transparent', 
                color: '#ff4d4d', 
                border: '1px solid #ff4d4d', 
                padding: '6px 16px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              Sair
            </button>
          </div>
        </div>

        <div className={styles.Divider_1_2521}>
          <svg width="100%" height="1" viewBox="0 0 1536 1" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0H1536" stroke="var(--border-input)" />
          </svg>
        </div>
      </header>

      <div className={styles.bannerContainer}></div>
      
      <div className={styles.profileSection}>
        <div className={styles.avatarContainer}>
          <svg className={styles.avatarSvg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
          </svg>
        </div>
        
        <h2 className={styles.username}>
          {usuario.nome} 
          {usuario.verificado && (
            <span className={styles.verifiedBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            </span>
          )}

          <span 
            className={styles.settingsIconContainer}
            onClick={() => onNavigate('PerfilConfig')}
            title="Configurações do Perfil"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </span>
        </h2>
      </div>

      <div className={`${styles.controlsRow} ${styles.justifyEnd}`}>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Buscar nos meus produtos" 
            className={styles.searchBar}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <main className={styles.productsGrid}>
        
        <div className={styles.addCardOuter}>
          <div className={styles.addCardSquare}>
            <button className={styles.addBtn} onClick={() => onNavigate('AddProduto')}>
              <span className={styles.plusIcon}>+</span>
              <span className={styles.addText}>Adicionar item</span>
            </button>
          </div>
          <div className={styles.productInfoPlaceholder}></div>
        </div>

        {loading ? (
          <div style={{ color: 'var(--cor-texto-dark)', padding: '20px', fontFamily: 'sans-serif' }}>
            Carregando seus anúncios...
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div style={{ color: 'var(--cor-texto-dark)', padding: '20px', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
            Você ainda não possui anúncios ativos.
          </div>
        ) : (
          produtosFiltrados.map((product) => (
            <div 
              key={product.id} 
              className={styles.productCard}
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => {
                localStorage.setItem('idProdutoSelecionado', String(product.id));
                onNavigate('EditarProduto');
              }}
            >
              <button 
                onClick={(e) => handleDeletarProduto(e, product.id)}
                style={{
                  position: 'absolute', top: '10px', right: '10px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                }}
                title="Apagar Anúncio"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>

              <div 
                className={styles.productImagePlaceholder}
                style={{
                  backgroundImage: product.imagemUrl ? `url(${product.imagemUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#e2e8f0'
                }}
              >
                {!product.imagemUrl && <span>Sem imagem</span>}
              </div>
              
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.title}</h3>
                <p className={styles.productPrice}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </p>
              </div>
            </div>
          ))
        )}
      </main>

      <footer className={styles.footer} style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: '100%',
        padding: '24px 32px',
        borderTop: '1px solid var(--border-input, #e2e8f0)',
        boxSizing: 'border-box'
      }}>
        <div className={styles.footerCopy} style={{ 
          fontSize: '14px', 
          color: 'var(--cor-texto-dark, #64748b)', 
          fontWeight: '600'
        }}>
          © {new Date().getFullYear()} CampusMarket. Todos os direitos reservados.
        </div>
        <div className={styles.footerLinks}>
          <a href="#suporte" style={{ 
            color: 'var(--cor-primaria, #3b82f6)', 
            textDecoration: 'none', 
            fontWeight: '600',
            fontSize: '16px' 
          }}>
            Suporte
          </a>
        </div>
      </footer>
    </div>
  );
}