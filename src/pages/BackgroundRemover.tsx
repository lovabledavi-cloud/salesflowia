import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { removeBackground, loadImage } from '@/lib/removeBackground';

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProcessedImage(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    setProgress('Iniciando...');

    try {
      const img = await loadImage(originalImage);
      const resultBlob = await removeBackground(img, setProgress);
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
      setProgress('Concluído!');
    } catch (err) {
      console.error('Error:', err);
      setError('Erro ao processar imagem. Tente novamente ou use outra imagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'logo-transparent.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Remover Fundo de Imagem</h1>
        <p className="text-muted-foreground text-center mb-8">
          Use IA para remover o fundo da sua logo automaticamente
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Original Image */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold mb-4">Imagem Original</h2>
            
            {originalImage ? (
              <div className="relative">
                <div 
                  className="w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden"
                  style={{ 
                    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                >
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Trocar imagem
                </Button>
              </div>
            ) : (
              <div 
                className="w-full aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Clique para selecionar imagem</p>
              </div>
            )}
            
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileSelect}
              className="hidden"
            />
          </Card>

          {/* Processed Image */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold mb-4">Imagem Processada</h2>
            
            <div 
              className="w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            >
              {processedImage ? (
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-12 h-12 animate-spin" />
                      <p>{progress}</p>
                    </div>
                  ) : (
                    <p>Resultado aparecerá aqui</p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {processedImage && (
              <div className="mt-4 flex items-center gap-2 text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span>Fundo removido com sucesso!</span>
              </div>
            )}
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            size="lg"
            onClick={handleProcess}
            disabled={!originalImage || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Remover Fundo'
            )}
          </Button>
          
          {processedImage && (
            <Button size="lg" variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Baixar PNG
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          O processamento é feito localmente no seu navegador usando WebGPU.
          <br />Nenhuma imagem é enviada para servidores externos.
        </p>
      </div>
    </div>
  );
};

export default BackgroundRemover;
