import express  from 'express';
import { nanoid } from 'nanoid';
import { Low }   from 'lowdb';
import { JSONFile } from 'lowdb/node';
import cors     from 'cors';
import crypto   from 'crypto';
import path     from 'path';

import validator from 'validator';

const app      = express();
const dbFile   = path.join(process.cwd(), 'db.json');
const adapter  = new JSONFile(dbFile);
const db       = new Low(adapter, { passwords: [] });

// Middleware
// Solo permite dominios de confianza. DSS
app.use(cors({
  origin: ['http://localhost:3000'],
}));

// Agrega un límite al middleware JSON. DSS
app.use(express.json({ limit: '10kb' })); // Máximo 10kb por petición.

app.use(express.static('public'));   // sirve index.html
app.use('/assets', express.static('assets')); // sirve los favicons y manifest


await db.read();
await db.write();

// contraseña segura
const charset =
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789' +
  '!@#$%^&*()_+~`|}{[]:;?><,./-¿¡';

function createPassword(len=16){
  let out = '';
  for(let i=0;i<len;i++){
    out += charset[crypto.randomInt(0, charset.length)];
  }
  return out;
}

// Rutas

// Generar
app.get('/api/generate', (req,res)=>{
  const length   = parseInt(req.query.length) || 16;
  res.json({ password:createPassword(length) });
});

// Crear
app.post('/api/passwords', async (req,res)=>{
  const { password, label='' } = req.body;
  if(!password) return res.status(400).json({ error:'Campo "contraseña" requerido' });
  
  // Evita inyecciones y errores de datos maliciosos. DSS
  if (!password || typeof password !== 'string' || password.length > 128) {
  return res.status(400).json({ error: 'Contraseña inválida' });
  }
  if (label && !validator.isAscii(label)) {
    return res.status(400).json({ error: 'Nombre no válido' });
  }

  db.data.passwords.push({
    id        : nanoid(),
    password,
    label,
    createdAt : new Date().toISOString()
  });
  await db.write();
  res.status(201).json({ success:true });
});

// Listar
app.get('/api/passwords', (req,res)=>{
  res.json(db.data.passwords);
});

// Editar
app.put('/api/passwords/:id', async (req,res)=>{
  const { id } = req.params;
  const { password, label } = req.body;
  const item = db.data.passwords.find(p => p.id === id);
  if(!item) return res.status(404).json({ error:'No existe' });

  if(password !== undefined) item.password = password;
  if(label    !== undefined) item.label    = label;
  await db.write();
  res.json({ success:true });
});

// Eliminar
app.delete('/api/passwords/:id', async (req,res)=>{
  const { id } = req.params;
  const prevLen = db.data.passwords.length;
  db.data.passwords = db.data.passwords.filter(p => p.id !== id);
  if(prevLen === db.data.passwords.length){
    return res.status(404).json({ error:'No existe' });
  }
  await db.write();
  res.json({ success:true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));
