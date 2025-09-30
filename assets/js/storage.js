// StorageAPI - encapsula localStorage para clientes, bicicletas e alugueis
(function(global){
  const KEYS = {
    clientes: 'crud_clientes',
    bicicletas: 'crud_bicicletas',
    alugueis: 'crud_alugueis',
    seq: 'crud_seq'
  };

  function load(key){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      console.error('Erro ao ler localStorage', e);
      return [];
    }
  }
  function save(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function nextId(){
    const raw = localStorage.getItem(KEYS.seq);
    const seq = raw ? JSON.parse(raw) : {clientes:1, bicicletas:1, alugueis:1};
    const out = {...seq};
    return {
      cliente(){ const id = out.clientes++; localStorage.setItem(KEYS.seq, JSON.stringify(out)); return id; },
      bicicleta(){ const id = out.bicicletas++; localStorage.setItem(KEYS.seq, JSON.stringify(out)); return id; },
      aluguel(){ const id = out.alugueis++; localStorage.setItem(KEYS.seq, JSON.stringify(out)); return id; }
    }
  }

  const StorageAPI = {
    KEYS,
    resetAll(){
      [KEYS.clientes, KEYS.bicicletas, KEYS.alugueis, KEYS.seq].forEach(k=>localStorage.removeItem(k));
    },

    // Clientes
    listClientes(){ return load(KEYS.clientes); },
    getCliente(id){ return this.listClientes().find(c=>c.id===id); },
    upsertCliente(data){
      const list = this.listClientes();
      if(!data.id){ data.id = nextId().cliente(); list.push(data); }
      else{
        const idx = list.findIndex(c=>c.id===data.id);
        if(idx>=0) list[idx] = data; else list.push(data);
      }
      save(KEYS.clientes, list); return data;
    },
    removeCliente(id){ save(KEYS.clientes, this.listClientes().filter(c=>c.id!==id)); },

    // Bicicletas
    listBicicletas(){ return load(KEYS.bicicletas); },
    getBicicleta(id){ return this.listBicicletas().find(b=>b.id===id); },
    upsertBicicleta(data){
      const list = this.listBicicletas();
      if(!data.id){ data.id = nextId().bicicleta(); list.push(data); }
      else{
        const idx = list.findIndex(b=>b.id===data.id);
        if(idx>=0) list[idx] = data; else list.push(data);
      }
      save(KEYS.bicicletas, list); return data;
    },
    removeBicicleta(id){ save(KEYS.bicicletas, this.listBicicletas().filter(b=>b.id!==id)); },

    // Aluguéis
    listAlugueis(){ return load(KEYS.alugueis); },
    getAluguel(id){ return this.listAlugueis().find(a=>a.id===id); },
    upsertAluguel(data){
      const list = this.listAlugueis();
      if(!data.id){ data.id = nextId().aluguel(); list.push(data); }
      else{
        const idx = list.findIndex(a=>a.id===data.id);
        if(idx>=0) list[idx] = data; else list.push(data);
      }
      save(KEYS.alugueis, list); return data;
    },
    removeAluguel(id){ save(KEYS.alugueis, this.listAlugueis().filter(a=>a.id!==id)); },
  };

  global.StorageAPI = StorageAPI;
})(window);
