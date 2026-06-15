/*
So to informando para o TypeScript que está tudo certo, 
já que o TypeScript nativamente só entende arquivos de código (como .ts, .tsx, .js). 
Quando tento importar um arquivo de estilos css, ele assume erro
*/
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}