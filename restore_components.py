#!/usr/bin/env python3
"""
Script para adicionar os componentes Profile, SettingsPage e Help que estão faltando
"""

import re

def add_missing_components():
    file_path = r'g:\Projeto\APP\Testador de APP\marina-boat-app\App.tsx'
    
    # Ler o arquivo
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Componentes a adicionar (antes do MainContent)
    components_code = '''
// --- Página: Perfil ---

const Profile = () => {
  const { currentUser, updateUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Meu Perfil</h2>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
            {currentUser.avatar_initial}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h3>
            <p className="text-slate-500 dark:text-slate-400">{currentUser.user_type === 'cliente' ? 'Cliente' : 'Administrador'}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nome Completo</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              <Save size={18} className="mr-2" />
              Salvar Alterações
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
              <p className="text-lg text-slate-900 dark:text-white">{currentUser.email}</p>
            </div>
            {currentUser.phone && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Telefone</p>
                <p className="text-lg text-slate-900 dark:text-white">{currentUser.phone}</p>
              </div>
            )}
            {currentUser.cpf && (
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">CPF</p>
                <p className="text-lg text-slate-900 dark:text-white font-mono">{currentUser.cpf}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

// --- Página: Configurações ---

const SettingsPage = () => {
  const { notificationSettings, updateNotificationSettings } = useAppContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Configurações</h2>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Notificações</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Email</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receber notificações por email</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.email}
              onChange={(e) => updateNotificationSettings({ ...notificationSettings, email: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Push</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receber notificações push</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.push}
              onChange={(e) => updateNotificationSettings({ ...notificationSettings, push: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">SMS</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receber notificações por SMS</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.sms}
              onChange={(e) => updateNotificationSettings({ ...notificationSettings, sms: e.target.checked })}
              className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- Página: Ajuda ---

const Help = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Ajuda</h2>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Perguntas Frequentes</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-slate-900 dark:text-white mb-2">Como solicitar um serviço?</p>
            <p className="text-slate-600 dark:text-slate-400">Clique em "Serviços" no menu lateral e depois em "Novo Serviço".</p>
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white mb-2">Como acompanhar meus serviços?</p>
            <p className="text-slate-600 dark:text-slate-400">Acesse o Dashboard para ver um resumo ou vá em "Serviços" para ver todos os detalhes.</p>
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white mb-2">Precisa de mais ajuda?</p>
            <p className="text-slate-600 dark:text-slate-400">Entre em contato conosco pelo email: suporte@marina.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

'''
    
    # Encontrar onde inserir (antes do MainContent)
    pattern = r'(const MainContent = \(\) => {)'
    
    if 'const Profile =' not in content:
        content = re.sub(pattern, components_code + r'\1', content)
        print("✅ Componentes Profile, SettingsPage e Help adicionados")
    else:
        print("ℹ️  Componentes já existem")
    
    # Salvar o arquivo
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Componentes restaurados com sucesso!")

if __name__ == "__main__":
    add_missing_components()
