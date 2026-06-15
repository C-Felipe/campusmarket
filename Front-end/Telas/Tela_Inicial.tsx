import React, { useState, useEffect } from 'react';
import styles from './Tela_Inicial.module.css';
import api from '../api';

export interface ProdutoBackend {
  id: number;
  title: string;
  price: string;
  seller: string;
  category: string;
  imagemUrl?: string;
  imageClass?: string;
}

interface ProductCardProps {
  product: ProdutoBackend;
  onNavigate: (tela: string, id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const urlImagem = product.imagemUrl
    ? `${api.defaults.baseURL?.replace('/api', '')}${product.imagemUrl}`
    : undefined;

  return (
    <div
      className={styles.StoreItemFixed_1_2543}
      onClick={() => onNavigate('Produto', product.id)}
      style={{ cursor: 'pointer' }}
    >
      <div
        className={`${styles.ImageProductPhoto_1_2544} ${product.imageClass ? styles[product.imageClass] : ''}`}
        style={{
          backgroundImage: urlImagem ? `url(${urlImagem})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: urlImagem ? 'transparent' : '#e2e8f0'
        }}
      >
        {!urlImagem && <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Sem Imagem</span>}
      </div>

      <div className={styles.TextContent_1_2545}>
        <span className={styles.ItemTitle_1_2546}>{product.title}</span>
        <span className={styles.generated_79_1_2547}>{product.price}</span>
        <div className={styles.PageLink1_1_3533}>
          <div className={styles.User_1_3534}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.45" d="M13.3334 14V12.6667C13.3334 11.9594 13.0524 11.2811 12.5523 10.781C12.0522 10.281 11.3739 10 10.6667 10H5.33335C4.62611 10 3.94783 10.281 3.44774 10.781C2.94764 11.2811 2.66669 11.9594 2.66669 12.6667V14M10.6667 4.66667C10.6667 6.13943 9.47278 7.33333 8.00002 7.33333C6.52726 7.33333 5.33335 6.13943 5.33335 4.66667C5.33335 3.19391 6.52726 2 8.00002 2C9.47278 2 10.6667 3.19391 10.6667 4.66667Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className={styles.Home_1_3535}>{product.seller}</span>
        </div>
      </div>
    </div>
  );
};

const categories = ['Todos', 'Acessórios', 'Aluguel', 'Comida', 'Eletrodomésticos', 'Eletrônicos', 'Materiais', 'Móveis', 'Periféricos', 'Roupas'] as const;
type Category = typeof categories[number];

interface TelaInicialProps {
  onNavigate: (tela: string, produtoId?: number) => void;
}

export default function Tela_Inicial({ onNavigate }: TelaInicialProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const [produtos, setProdutos] = useState<ProdutoBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarAnuncios() {
      try {
        setLoading(true);
        const response = await api.get('/anuncios');

        const produtosMapeados: ProdutoBackend[] = response.data.map((item: any) => ({
          id: item.id,
          title: item.titulo,
          price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco),
          seller: item.nomeVendedor,
          category: item.categoria,
          imagemUrl: item.imagemUrl
        }));

        setProdutos(produtosMapeados);
      } catch (err) {
        console.error("Erro ao carregar feed:", err);
        setErro("Não foi possível carregar os produtos. Verifique se o servidor está rodando.");
      } finally {
        setLoading(false);
      }
    }
    carregarAnuncios();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const filteredProducts = produtos.filter((product) => {
    const matchesCategory = selectedCategory === 'Todos' || product.category?.includes(selectedCategory.split(' ')[0]);
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return matchesCategory && (
      normalizedQuery.length === 0 ||
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.seller.toLowerCase().includes(normalizedQuery) ||
      product.category?.toLowerCase().includes(normalizedQuery)
    );
  });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  return (
    <div className={styles.Tela_1_1_2489}>
      <div className={styles.headerWrapper}>
        <header className={styles.Barra_1_2833}>
          <div className={styles.Logo_1_2491} onClick={() => onNavigate('Inicial')} style={{ cursor: 'pointer' }}>
            <span className={styles.CampusBazaar_1_2492}>CampusMarket</span>
          </div>

          {/* Botão de "Anunciar Produto" com trava de Login */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => {
                const temToken = localStorage.getItem('token');
                if (temToken) {
                  onNavigate('AddProduto');
                } else {
                  alert('Você precisa fazer login para anunciar!');
                  onNavigate('Login');
                }
              }}
              style={{
                backgroundColor: 'var(--cor-primaria)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              + Anunciar Produto
            </button>
          </div>

          {/* Ícone de Perfil com trava de Login */}
          <div className={styles.Icons_1_2493}>
            <div
              className={styles.User_1_2496}
              onClick={() => {
                const temToken = localStorage.getItem('token');
                if (temToken) {
                  onNavigate('Perfil');
                } else {
                  onNavigate('Login');
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" />
              </svg>
            </div>
          </div>
        </header>
      </div>

      <main className={styles.MainContent_1_2523}>
        <div className={styles.ThreeColumnProductGridWithFilters_1_2524}>

          <div className={styles.Filters_1_2525}>
            <div className={styles.Header_1_2526}>
              <div className={styles.FilterCategories_1_3856}>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={selectedCategory === category ? styles.Filter_1_3810 : styles.Filter_1_3812}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                  >
                    <span className={selectedCategory === category ? styles.SortBy_1_3811 : styles.Price_1_3813}>
                      {category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Buscar por nome, categoria ou vendedor"
                className={styles.searchBar}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className={styles.searchIcon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          <div className={styles.ProductGrid_1_2541}>
            {loading ? (
              <div style={{ color: 'var(--cor-texto-dark)', fontFamily: '"Baloo 2", sans-serif', fontSize: '18px', padding: '24px 0', gridColumn: '1 / -1', textAlign: 'center' }}>
                Carregando os produtos do campus...
              </div>
            ) : erro ? (
              <div style={{ color: '#ff4d4d', fontFamily: '"Baloo 2", sans-serif', fontSize: '18px', padding: '24px 0', gridColumn: '1 / -1', textAlign: 'center' }}>
                ⚠️ {erro}
              </div>
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))
            ) : (
              <div style={{ color: 'var(--cor-texto-dark)', fontFamily: '"Baloo 2", sans-serif', fontSize: '18px', padding: '24px 0', gridColumn: '1 / -1', textAlign: 'center' }}>
                Nenhum produto encontrado.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.Pagination_1_2590}>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isPageActive = currentPage === pageNumber;

                return (
                  <div
                    key={pageNumber}
                    className={isPageActive ? styles.Page_1_2591 : styles.Page_1_2593}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span className={isPageActive ? styles.generated_1_1_2592 : styles.generated_2_1_2594}>
                      {pageNumber}
                    </span>
                  </div>
                );
              })}

              {currentPage < totalPages && (
                <div
                  className={styles.Next_1_2601}
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5L15 12L9 19" />
                  </svg>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <div className={styles.footerWrapper}>
        <footer className={styles.BasicFooter_70_3628} style={{ 
  display: 'flex', 
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  width: '100%',
  padding: '32px 32px',
  borderTop: '1px solid var(--border-input, #e2e8f0)',
  backgroundColor: 'transparent',
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
    </div>
  );
}