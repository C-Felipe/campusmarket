import React, { useState, useEffect, useRef } from 'react';
import styles from './Tela_AddProduto.module.css';
import api from '../api';

interface TelaEditarProdutoProps {
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

function obterChaveCategoria(valor: string): string {
  return Object.keys(CATEGORIAS_MAP).find(key => CATEGORIAS_MAP[key] === valor) || '';
}

export default function Tela_EditarProduto({ onNavigate }: TelaEditarProdutoProps) {
  
  if (!localStorage.getItem('token')) {
    onNavigate('Login');
    return null;
  }

  const [idProduto, setIdProduto] = useState<string | null>(null);
  const [nomeProduto, setNomeProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<string>('');
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [enviando, setEnviando] = useState<boolean>(false);

  const [file1, setFile1] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  
  const fileInputRef1 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function carregarProduto() {
      const idSalvo = localStorage.getItem('idProdutoSelecionado');
      if (!idSalvo) {
        alert('Produto não selecionado.');
        onNavigate('Perfil');
        return;
      }
      setIdProduto(idSalvo);

      try {
        setEnviando(true);
        const resposta = await api.get(`/anuncios/${idSalvo}`);
        const dados = resposta.data;

        setNomeProduto(dados.titulo || '');
        setPreco(String(dados.preco || '').replace('.', ','));
        setDescricao(dados.descricao || '');
        
        const chaveCategoria = obterChaveCategoria(dados.categoria);
        setCategoria(chaveCategoria);

        if (dados.imagemUrl) {
          setPreview1(`${api.defaults.baseURL?.replace('/api', '')}${dados.imagemUrl}`);
        }
      } catch (err: any) {
        alert('Erro ao carregar os dados do anúncio.');
      } finally {
        setEnviando(false);
      }
    }

    carregarProduto();
  }, [onNavigate]);

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

  const handleSalvarAlteracoes = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeProduto || !preco || !categoria || !descricao || !idProduto) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setEnviando(true);

      const formData = new FormData();
      formData.append('Titulo', nomeProduto);
      formData.append('Preco', String(preco).replace(',', '.')); 
      formData.append('Categoria', CATEGORIAS_MAP[categoria]); 
      formData.append('Descricao', descricao);
      
      if (file1) {
        formData.append('Imagem', file1);
      }

      await api.put(`/anuncios/${idProduto}`, formData);

      alert('Anúncio atualizado com sucesso.');
      localStorage.removeItem('idProdutoSelecionado');
      onNavigate('Perfil');
    } catch (err: any) {
      console.error("Erro detalhado:", err.response?.data);
      let msg = 'Erro ao atualizar o anúncio.';
      if (err.response?.data) {
        msg = typeof err.response.data === 'string' ? err.response.data : (err.response.data.title || 'Erro na requisição');
      }
      alert(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.Tela_7_70_3480}>
      <header className={styles.Barra_70_4521}>
        <div className={styles.Logo_1_2491} onClick={() => onNavigate('Inicial')} style={{ cursor: 'pointer' }}>
          <span className={styles.CampusBazaar_1_2492}>CampusMarket</span>
        </div>
        <div className={styles.Icons_1_2493} onClick={() => onNavigate('Perfil')} style={{ cursor: 'pointer' }}>
          <svg className={styles.User_1_2496} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cor-texto-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </header>

      <main className={styles.Container_70_4216}>
        <form onSubmit={handleSalvarAlteracoes} className={styles.MainContent_70_3490}>
          <h2 style={{ marginBottom: '20px', color: 'var(--cor-texto-dark)' }}>Editar Anúncio</h2>
          
          <div className={styles.Container_70_4013}>
            <input type="text" className={styles.ProductName_70_4014} placeholder="Nome do Produto *" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} disabled={enviando} required />
            <input type="text" className={styles._00_70_4015} placeholder="Preço (R$) *" value={preco} onChange={(e) => setPreco(e.target.value)} disabled={enviando} required />
          </div>

          <div className={styles.Row_70_4334}>
            <input type="file" accept="image/*" ref={fileInputRef1} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, setFile1, setPreview1)} />
            <div className={styles.ImageProductPhoto_70_4336} onClick={() => !enviando && fileInputRef1.current?.click()} style={{ cursor: enviando ? 'not-allowed' : 'pointer', width: '100%', maxWidth: '300px' }}>
              {preview1 ? <img src={preview1} alt="Principal" className={styles.previewImage} /> : "+ Alterar Foto do Produto"}
            </div>
          </div>

          <section className={styles.About_70_4034}>
            <h2 className={styles.AddNewProduct_70_4035}>Categoria do Produto *</h2>
            <div className={styles.DropdownContainer_Custom}>
              <button type="button" className={`${styles.SelectCategory_Button_Custom} ${isOpen ? styles.Active_Custom : ''}`} onClick={toggleDropdown} disabled={enviando}>
                {categoria !== '' ? CATEGORIAS_MAP[categoria] : 'Selecione uma categoria...'}
              </button>
              {isOpen && (
                <ul className={styles.DropdownList_Custom}>
                  {Object.keys(CATEGORIAS_MAP).map((key) => (
                    <li key={key} className={styles.DropdownItem_Custom} onClick={() => handleSelectOption(key)}>{CATEGORIAS_MAP[key]}</li>
                  ))}
                </ul>
              )}
            </div>

            <h2 className={styles.AddNewProduct_70_4035} style={{ marginTop: '24px' }}>Descrição do Produto *</h2>
            <textarea className={styles.InputMultiLine_70_4511} placeholder="Escreva detalhes sobre o estado de conservação..." value={descricao} onChange={(e) => setDescricao(e.target.value)} disabled={enviando} required />
          </section>

          <div className={styles.Container_70_4031} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <button 
              className={styles.ButtonFilledStandard_70_4044} 
              type="submit" 
              disabled={enviando}
              style={{ width: '100%', height: 'auto', minHeight: '44px', padding: '12px 16px', whiteSpace: 'normal' }}
            >
              {enviando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button 
              className={styles.ButtonOutlinedStandard_70_4041} 
              type="button" 
              onClick={() => onNavigate('Perfil')}
              style={{ width: '100%', height: 'auto', minHeight: '44px', padding: '12px 16px', margin: 0, whiteSpace: 'normal' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}