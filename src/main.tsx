import { StrictMode, Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './Admin';

class AppErrorBoundary extends Component<{children:ReactNode},{error:Error|null}> {
  state={error:null as Error|null};
  static getDerivedStateFromError(error:Error){ return {error}; }
  componentDidCatch(error:Error, info:any){ console.error('Panorama runtime error:', error, info); }
  render(){
    if(this.state.error) return <div dir="rtl" style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:24,background:'#f5f1e9',fontFamily:'Cairo,system-ui,sans-serif',color:'#22251f'}}><div style={{maxWidth:620,width:'100%',background:'#fff',padding:32,boxShadow:'0 20px 60px #202a2520'}}><div style={{fontSize:12,letterSpacing:'.12em',color:'#b99761'}}>PANORAMA HOTEL ADEN</div><h1 style={{fontSize:28,margin:'10px 0'}}>حدث خطأ أثناء تشغيل الموقع</h1><p style={{lineHeight:1.9,color:'#777167'}}>تم إيقاف جزء من الواجهة بسبب خطأ برمجي. هذه الرسالة مؤقتة لتسهيل التشخيص بدل ظهور صفحة بيضاء.</p><details><summary style={{cursor:'pointer'}}>تفاصيل الخطأ</summary><pre style={{whiteSpace:'pre-wrap',direction:'ltr',fontSize:11,marginTop:12}}>{this.state.error.message}</pre></details><button onClick={()=>location.reload()} style={{marginTop:20,border:0,background:'#2e3a32',color:'#fff',padding:'12px 18px',cursor:'pointer'}}>إعادة تحميل الموقع</button></div></div>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      {window.location.pathname==='/admin'?<Admin/>:<App/>}
    </AppErrorBoundary>
  </StrictMode>
);
