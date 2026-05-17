declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

/** Side-effect imports: `import './tokens.css'` */
declare module '*.css';
