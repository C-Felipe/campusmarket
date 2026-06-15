import React, { useState, useEffect } from 'react';
import Tela_Inicial from './Telas/Tela_Inicial';
import Tela_Login from './Telas/Tela_Login';
import Tela_Cadastro from './Telas/Tela_Cadastro'; 
import Tela_Perfil from './Telas/Tela_Perfil';
import Tela_PerfilConfig from './Telas/Tela_PerfilConfig';
import Tela_Produto from './Telas/Tela_Produto';
import Tela_AddProduto from './Telas/Tela_AddProduto';
import Tela_EditarProduto from './Telas/Tela_EditarProduto';
import './global.css';

export default function App() {
  const [telaAtiva, setTelaAtiva] = useState<string>('Inicial');

  const [temaEscuro, setTemaEscuro] = useState<boolean>(false);

  const [idProdutoSelecionado, setIdProdutoSelecionado] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (temaEscuro) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [temaEscuro]);

  const navegarPara = (proximaTela: string, produtoId?: number) => {
    if (produtoId !== undefined) {
      setIdProdutoSelecionado(produtoId);
    }
    setTelaAtiva(proximaTela);
  };

  const renderizarTela = () => {
    switch (telaAtiva) {
      case 'Login': 
        return <Tela_Login onNavigate={navegarPara} />;
      case 'Cadastro': 
        return <Tela_Cadastro onNavigate={navegarPara} />;
      case 'Inicial': 
        return <Tela_Inicial onNavigate={navegarPara} />;
      case 'Perfil': 
        return <Tela_Perfil onNavigate={navegarPara} />;
      case 'PerfilConfig': 
        return (
          <Tela_PerfilConfig 
            onNavigate={navegarPara} 
            temaEscuro={temaEscuro} 
            setTemaEscuro={setTemaEscuro} 
          />
        );
      case 'Produto': 
        return <Tela_Produto onNavigate={navegarPara} produtoId={idProdutoSelecionado} />;
      case 'EditarProduto': 
    return <Tela_EditarProduto onNavigate={navegarPara} />;
      case 'AddProduto': 
        return <Tela_AddProduto onNavigate={navegarPara} />;
      default: 
        return <Tela_Login onNavigate={navegarPara} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-popeye)', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s ease' 
    }}>
      
      {/* Container que renderiza a tela selecionada de ponta a ponta */}
      <div style={{ width: '100%' }}>
        {renderizarTela()}
      </div>

    </div>
  );
}