// Utils de validação e helpers
const Utils = (() => {
  function onlyDigits(s){ return (s||'').replace(/\D+/g,''); }

  function validateCPF(cpf){
    cpf = onlyDigits(cpf);
    if(!cpf || cpf.length !== 11) return false;
    if(/^([0-9])\1+$/.test(cpf)) return false;
    let sum = 0;
    for(let i=0;i<9;i++) sum += parseInt(cpf[i])*(10-i);
    let rev = 11 - (sum % 11); if(rev>=10) rev = 0; if(rev !== parseInt(cpf[9])) return false;
    sum = 0;
    for(let i=0;i<10;i++) sum += parseInt(cpf[i])*(11-i);
    rev = 11 - (sum % 11); if(rev>=10) rev = 0; if(rev !== parseInt(cpf[10])) return false;
    return true;
  }

  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email||'');
  }

  function validatePhone(phone){
    const d = onlyDigits(phone);
    return d.length>=10 && d.length<=11;
  }

  function maskCPF(value){
    const d = onlyDigits(value).slice(0,11);
    let out = '';
    if(d.length>0) out = d.substring(0,3);
    if(d.length>3) out += '.' + d.substring(3,6);
    if(d.length>6) out += '.' + d.substring(6,9);
    if(d.length>9) out += '-' + d.substring(9,11);
    return out;
  }

  function maskPhone(value){
    const d = onlyDigits(value).slice(0,11);
    if(d.length <= 10){
      // (DD) XXXX-XXXX
      const p1 = d.substring(0,2);
      const p2 = d.substring(2,6);
      const p3 = d.substring(6,10);
      return (p1?`(${p1}`:'') + (p1?') ':'') + p2 + (p3?`-${p3}`:'');
    } else {
      // (DD) XXXXX-XXXX
      const p1 = d.substring(0,2);
      const p2 = d.substring(2,7);
      const p3 = d.substring(7,11);
      return (p1?`(${p1}`:'') + (p1?') ':'') + p2 + (p3?`-${p3}`:'');
    }
  }

  function toBase64(file){
    return new Promise((resolve,reject)=>{
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function parseISO(dateStr){
    if(!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }
  function formatDate(dateStr){
    const d = parseISO(dateStr); if(!d) return '-';
    return d.toLocaleDateString();
  }
  function overlaps(aStart, aEnd, bStart, bEnd){
    const aS = parseISO(aStart)?.getTime(); const aE = parseISO(aEnd)?.getTime();
    const bS = parseISO(bStart)?.getTime(); const bE = parseISO(bEnd)?.getTime();
    if([aS,aE,bS,bE].some(v=>v==null)) return false;
    return aS <= bE && bS <= aE;
  }
  function nowISO(){
    const d = new Date();
    const pad = (n) => n.toString().padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }
  function getRentalStatus(al){
    const now = new Date();
    const s = parseISO(al.data_saida);
    const r = parseISO(al.data_retorno);
    if(!s || !r) return 'indefinido';
    if(now < s) return 'futuro';
    if(now > r) return 'finalizado';
    return 'ativo';
  }

  return { onlyDigits, validateCPF, validateEmail, validatePhone, toBase64, parseISO, overlaps, nowISO, getRentalStatus, formatDate, maskCPF, maskPhone };
})();
