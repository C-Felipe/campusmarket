import React, { useState, useRef } from 'react';
import styles from './Tela_AddProduto.module.css';
import api from '../api';

interface TelaAddProdutoProps {
  onNavigate: (tela: string) => void;
}

const CATEGORIAS_MAP: Record<string, string> = {
  acessorios: 'Acessórios',
  aluguel: 'Aluguel',
  comida: 'Comida & Lanches',
  eletrodomesticos: 'Eletrodomésticos',
  eletronicos: 'Eletrônicos',
  materiais: 'Materiais',
  moveis: 'Móveis',
  perifericos: 'Periféricos',
  roupas: 'Roupas'
};

export default function Tela_AddProduto({ onNavigate }: TelaAddProdutoProps) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [enviando, setEnviando] = useState<boolean>(false);

  const [file1, setFile1] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  
  const fileInputRef1 = useRef<HTMLInputElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectOption = (val: string) => {
    setCategoria(val);
    setIsOpen(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setFile: (f: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleAdicionarProduto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeProduto || !preco || !categoria || !descricao) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setEnviando(true);

      const formData = new FormData();
      formData.append('Titulo', nomeProduto);
      formData.append('Preco', preco.replace(',', '.'));
      formData.append('Categoria', CATEGORIAS_MAP[categoria]);
      formData.append('Descricao', descricao);
      
      if (file1) {
        formData.append('Imagem', file1);
      }

      await api.post('/anuncios', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Anúncio publicado com sucesso.');
      onNavigate('Inicial');
    } catch (err: any) {
      const mensagemErro = err.response?.data?.error;
      alert(mensagemErro || 'Erro ao conectar com o servidor para criar o anúncio.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.Tela_7_70_3480}>
      <header className={styles.Barra_70_4521}>
        <div 
          className={styles.Logo_1_2491} 
          onClick={() => onNavigate('Inicial')} 
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.CampusBazaar_1_2492}>CampusMarket</span>
        </div>
        
        <div 
          className={styles.Icons_1_2493} 
          onClick={() => onNavigate('Perfil')} 
          style={{ cursor: 'pointer' }}
          aria-label="Ir para o Perfil"
        >
          <svg 
            className={styles.User_1_2496} 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--cor-texto-dark)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>

        <div className={styles.Divider_1_2521}>
          <svg width="100%" height="1" viewBox="0 0 1536 1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line y1="0.5" x2="1536" y2="0.5" stroke="var(--border-input)" />
          </svg>
        </div>
      </header>

      <main className={styles.Container_70_4216}>
        <form onSubmit={handleAdicionarProduto} className={styles.MainContent_70_3490}>
          
          <div className={styles.Container_70_4013}>
            <input 
              type="text" 
              className={styles.ProductName_70_4014} 
              placeholder="Nome do Produto *" 
              value={nomeProduto}
              onChange={(e) => setNomeProduto(e.target.value)}
              disabled={enviando}
              required
            />
            <input 
              type="text" 
              className={styles._00_70_4015} 
              placeholder="Preço (R$) *" 
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              disabled={enviando}
              required
            />
          </div>

          <div className={styles.Row_70_4334}>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef1} 
              style={{ display: 'none' }} 
              onChange={(e) => handleFileChange(e, setFile1, setPreview1)} 
            />

            <div 
              className={styles.ImageProductPhoto_70_4336} 
              onClick={() => !enviando && fileInputRef1.current?.click()}
              style={{ 
                cursor: enviando ? 'not-allowed' : 'pointer', 
                width: '100%', 
                maxWidth: '100%' 
              }}
            >
              {preview1 ? <img src={preview1} alt="Principal" className={styles.previewImage} /> : "+ Add Foto Principal (Opcional)"}
            </div>
          </div>

          <section className={styles.About_70_4034}>
            <h2 className={styles.AddNewProduct_70_4035}>Categoria do Produto *</h2>
            
            <div className={styles.DropdownContainer_Custom}>
              <button 
                type="button"
                className={`${styles.SelectCategory_Button_Custom} ${isOpen ? styles.Active_Custom : ''}`}
                onClick={toggleDropdown}
                disabled={enviando}
                style={{ opacity: categoria === '' ? 0.5 : 1 }}
              >
                {categoria !== '' ? CATEGORIAS_MAP[categoria] : 'Selecione uma categoria...'}
                
                <svg 
                  className={`${styles.DropdownArrow_Custom} ${isOpen ? styles.Open_Custom : ''}`}
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="var(--cor-texto-dark)"
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isOpen && (
                <ul className={styles.DropdownList_Custom}>
                  {Object.keys(CATEGORIAS_MAP).map((key) => (
                    <li
                      key={key}
                      className={`${styles.DropdownItem_Custom} ${categoria === key ? styles.DropdownItem_Selected_Custom : ''}`}
                      onClick={() => handleSelectOption(key)}
                    >
                      {CATEGORIAS_MAP[key]}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <h2 className={styles.AddNewProduct_70_4035} style={{ marginTop: '24px' }}>Descrição do Produto *</h2>
            <textarea 
              className={styles.InputMultiLine_70_4511} 
              placeholder="Escreva detalhes sobre o estado de conservação, tempo de uso ou especificações do produto..." 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={enviando}
              required
            />
          </section>

          <div className={styles.Container_70_4031} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              className={styles.ButtonFilledStandard_70_4044} 
              type="submit"
              disabled={enviando}
              style={{ width: '100%', height: 'auto', minHeight: '44px', padding: '12px 16px' }}
            >
              <span className={styles.AddToCart_70_4045} style={{ whiteSpace: 'normal' }}>
                {enviando ? 'Publicando...' : 'Adicionar Produto'}
              </span>
            </button>
            
            <button 
              className={styles.ButtonOutlinedStandard_70_4041} 
              type="button"
              onClick={() => onNavigate('Perfil')}
              disabled={enviando}
              style={{ width: '100%', height: 'auto', minHeight: '44px', padding: '12px 16px', margin: 0 }}
            >
              <span className={styles.SaveForLater_70_4042}>Cancelar</span>
            </button>
          </div>
        </form>
      </main>

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
  );
}