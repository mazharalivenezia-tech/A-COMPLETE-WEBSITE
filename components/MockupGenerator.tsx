import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';


// --- Helper Functions & Icons ---

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const imageUrlToBase64 = async (url: string): Promise<string> => {
    // Use a proxy or a server-side function if CORS is an issue.
    // For this environment, we assume direct fetch works.
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        return blobToBase64(blob);
    } catch (e) {
        console.error("Failed to fetch image for Base64 conversion:", e);
        // Fallback to a CORS proxy if direct fetch fails
        try {
            const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
            const proxyResponse = await fetch(proxyUrl);
            if (!proxyResponse.ok) {
                throw new Error(`Proxy HTTP error! status: ${proxyResponse.status}`);
            }
            const proxyBlob = await proxyResponse.blob();
            return blobToBase64(proxyBlob);
        } catch (proxyError) {
            console.error("Failed to fetch image via proxy:", proxyError);
            throw new Error("Could not load the image from the provided URL due to network or security restrictions.");
        }
    }
};

const loadingMessages = [
  'Warming up the AI design engine...',
  'Sketching initial concepts...',
  'Choosing the perfect fabric textures...',
  'Applying digital color swatches...',
  'Stitching the mockup together...',
  'Adding realistic lighting and shadows...',
  'Sourcing a virtual model...',
  'Setting up the fashion runway...',
  'Directing the virtual photoshoot...',
  'Rendering the final images...',
  'Finalizing the high-resolution details...',
  'Almost there, making it perfect!',
];

const EngagingLoader: React.FC<{ message?: string }> = ({ message }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center flex flex-col items-center justify-center p-4 transition-opacity duration-300">
      <svg className="w-20 h-20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="cool-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
                <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
            </linearGradient>
        </defs>
        <path 
            fill="none" 
            stroke="url(#cool-gradient)" 
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 240"
            d="M 50,10 a 40,40 0 1,1 0,80 a 40,40 0 1,1 0,-80">
            <animateTransform 
                attributeName="transform" 
                type="rotate" 
                from="0 50 50" 
                to="360 50 50" 
                dur="1.5s" 
                repeatCount="indefinite" />
        </path>
         <path 
            fill="none" 
            stroke="url(#cool-gradient)" 
            strokeOpacity="0.5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="10 140"
            d="M 50,25 a 25,25 0 1,1 0,50 a 25,25 0 1,1 0,-50">
            <animateTransform 
                attributeName="transform" 
                type="rotate" 
                from="360 50 50" 
                to="0 50 50" 
                dur="2s" 
                repeatCount="indefinite" />
        </path>
      </svg>
      <p className="mt-4 text-md font-semibold text-gray-700">{message || 'Generating your design...'}</p>
      <div className="mt-2 text-sm text-gray-500 min-h-[40px] flex items-center justify-center">
          <p className="transition-opacity duration-500">{loadingMessages[messageIndex]}</p>
      </div>
    </div>
  );
};

const WandIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046A4.993 4.993 0 0116.954 8H18a1 1 0 110 2h-1.046A4.993 4.993 0 0112 16.954V18a1 1 0 11-2 0v-1.046A4.993 4.993 0 015.046 12H4a1 1 0 110-2h1.046A4.993 4.993 0 0110 3.046V2a1 1 0 011.3-.954zM12 8a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const UploadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L13 9.414V13H5.5z" /><path d="M9 13h2v5a1 1 0 11-2 0v-5z" /></svg>;
const ColorPaletteIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 2v1h3V4H5zm0 2v1h3V6H5zm0 2v1h3V8H5zm0 2v1h3v-1H5zM15 2a1 1 0 00-1 1v11.586l-4.293-4.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L15 14.586V3a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const PatternIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM10 16a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.096 4.096a1 1 0 011.414 0l1 1a1 1 0 01-1.414 1.414l-1-1a1 1 0 010-1.414zM13.485 4.096a1 1 0 011.414 1.414l-1 1a1 1 0 01-1.414-1.414l1-1zM4.096 13.485a1 1 0 010 1.414l1 1a1 1 0 011.414-1.414l-1-1a1 1 0 01-1.414 0zM13.485 13.485a1 1 0 011.414 0l1 1a1 1 0 01-1.414 1.414l-1-1a1 1 0 010-1.414z" /></svg>;
const SolidIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 2a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2H2z" /></svg>;
const GradientIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="currentColor" stopOpacity="1" /><stop offset="100%" stopColor="currentColor" stopOpacity="0.3" /></linearGradient></defs><rect x="3" y="3" width="14" height="14" rx="2" fill="url(#grad1)" stroke="none" /></svg>;
const ProductIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const TextIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const PhotoIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const RotateIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10.5M20 20l-1.5-1.5A9 9 0 003.5 13.5" /></svg>;
const ScissorsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.243 5.757a1 1 0 010 1.414l-9.9 9.9a1 1 0 01-1.414-1.414l9.9-9.9a1 1 0 011.414 0zM4.929 15.071a1 1 0 01-1.414-1.414l9.9-9.9a1 1 0 011.414 1.414l-9.9 9.9z" clipRule="evenodd" /><path d="M4.222 11.333a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM15.778 8.667a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>;
const MagnifyingGlassPlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
);


// --- Product Selection Modal ---
const ProductSelectionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: Product) => void;
}> = ({ isOpen, onClose, onSelect }) => {
    const { products } = useProducts();
    const apparelProducts = products.filter(p => p.productType === 'Apparel').slice(0, 12);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">Select a Product</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {apparelProducts.map(product => (
                            <button key={product.id} onClick={() => onSelect(product)} className="group text-left">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <p className="text-sm font-medium mt-2 truncate">{product.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const MockupGenerator: React.FC = () => {
    // --- State ---
    type Step = 'selection' | 'generation' | 'customization';
    const [step, setStep] = useState<Step>('selection');
    const [generationSource, setGenerationSource] = useState<'describe' | 'upload' | 'product' | null>(null);

    const [prompt, setPrompt] = useState<string>('a plain white t-shirt');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [originalImageB64, setOriginalImageB64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [uploadedPhoto, setUploadedPhoto] = useState<{ file: File, preview: string } | null>(null);
    const [showProductModal, setShowProductModal] = useState<boolean>(false);

    // Customization state
    const [colorMode, setColorMode] = useState<'solid' | 'gradient'>('solid');
    const [color, setColor] = useState<string>('#3B82F6');
    const [gradientColor1, setGradientColor1] = useState<string>('#3B82F6');
    const [gradientColor2, setGradientColor2] = useState<string>('#FFFFFF');
    const [gradientDirection, setGradientDirection] = useState<string>('top to bottom');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoPosition, setLogoPosition] = useState({ x: 50, y: 35 });
    const [logoSize, setLogoSize] = useState(20);
    const [patternFile, setPatternFile] = useState<File | null>(null);
    const [patternPreview, setPatternPreview] = useState<string | null>(null);
    const [alterationPrompt, setAlterationPrompt] = useState<string>('');
    const [interactionState, setInteractionState] = useState<{
        type: 'drag' | 'resize' | 'pinch';
        startX: number;
        startY: number;
        startLogoX: number;
        startLogoY: number;
        startSize: number;
        initialPinchDistance?: number;
    } | null>(null);
    const [zoomActive, setZoomActive] = useState<boolean>(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const patternInputRef = useRef<HTMLInputElement>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);


    // --- Functions ---
    const handleApiError = (e: any, defaultMessage: string) => {
        console.error("Gemini API Error:", e);
        let errorMessage = defaultMessage;
        // The Gemini SDK often throws errors with a `message` property that might contain the status code or reason.
        const errorString = e.toString();
    
        if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
            errorMessage = "API quota exceeded. You may be making requests too quickly. Please wait a moment and try again. For more details, see your plan at ai.google.dev.";
        } else if (errorString.includes('500') || errorString.includes('INTERNAL')) {
            errorMessage = "The AI service encountered a temporary internal error. This is usually a transient issue. Please wait a few moments and try your request again.";
        }
        setError(errorMessage);
    };

    const checkApiKey = () => {
        if (!process.env.API_KEY) {
            setError("Configuration Error: The API Key is missing. This tool cannot function without it. Please ensure the application is correctly deployed with all necessary environment variables.");
            return false;
        }
        return true;
    };

    const resetAll = () => {
        setStep('selection');
        setGenerationSource(null);
        setPrompt('a plain white t-shirt');
        setGeneratedImage(null);
        setOriginalImageB64(null);
        setIsLoading(false);
        setError(null);
        setUploadedPhoto(null);
        setShowProductModal(false);
        setColor('#3B82F6');
        setLogoFile(null);
        setLogoPreview(null);
        setLogoPosition({ x: 50, y: 35 });
        setLogoSize(20);
        setPatternFile(null);
        setPatternPreview(null);
        setAlterationPrompt('');
    };

    const handleGenerateFromPrompt = async () => {
        if (!checkApiKey()) return;
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        setOriginalImageB64(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `a photorealistic 3d mockup of ${prompt}, studio lighting, plain white background, front view, centered in frame`,
                config: { numberOfImages: 1, outputMimeType: 'image/png', aspectRatio: '1:1' },
            });

            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            setGeneratedImage(`data:image/png;base64,${base64ImageBytes}`);
            setOriginalImageB64(base64ImageBytes);
            setStep('customization');
        } catch (e) {
            handleApiError(e, 'Failed to generate image. Please try a different prompt.');
            setStep('generation');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedPhoto({ file, preview: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUsePhotoDirectly = async () => {
        if (!uploadedPhoto) return;
        setIsLoading(true);
        try {
            const b64 = await blobToBase64(uploadedPhoto.file);
            setOriginalImageB64(b64);
            setGeneratedImage(uploadedPhoto.preview);
            setStep('customization');
        } catch (e) {
            setError('Could not process the uploaded file.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateFromPhoto = async () => {
        if (!uploadedPhoto) return;
        if (!checkApiKey()) return;
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const uploadedImageB64 = await blobToBase64(uploadedPhoto.file);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { inlineData: { data: uploadedImageB64, mimeType: uploadedPhoto.file.type } },
                        { text: 'Create a clean, photorealistic 3D mockup of the garment shown in the image. Place it on a plain white studio background with professional lighting. Remove any existing logos or patterns from the garment.' }
                    ]
                },
                config: { responseModalities: [Modality.IMAGE] },
            });
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    setGeneratedImage(`data:image/png;base64,${base64ImageBytes}`);
                    setOriginalImageB64(base64ImageBytes);
                    setStep('customization');
                }
            }
        } catch(e) {
            handleApiError(e, 'Failed to generate a new mockup from the photo.');
            setStep('generation');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProductSelect = async (product: Product) => {
        setShowProductModal(false);
        setIsLoading(true);
        setError(null);
        try {
            const b64 = await imageUrlToBase64(product.images[0]);
            setOriginalImageB64(b64);
            setGeneratedImage(product.images[0]);
            setStep('customization');
        } catch (e) {
            console.error(e);
            setError('Could not load product image. This can happen in deployed environments due to browser security (CORS) policies. Please try describing the item or uploading a photo instead.');
            setStep('selection');
        } finally {
            setIsLoading(false);
        }
    };

    const getPositionDescription = (x: number, y: number): string => {
        const yPos = y < 33 ? 'top' : y < 66 ? 'middle' : 'bottom';
        const xPos = x < 33 ? 'left' : x < 66 ? 'center' : 'right';

        if (yPos === 'middle' && xPos === 'center') return 'center';
        if (yPos === 'top' && xPos === 'center') return 'top center';
        if (yPos === 'middle' && xPos === 'left') return 'left chest';
        if (yPos === 'middle' && xPos === 'right') return 'right chest';
        
        return `${yPos} ${xPos}`;
    };

    const handleUpdate = async () => {
        if (!originalImageB64) return;
        if (!checkApiKey()) return;
        setIsLoading(true);
        setError(null);
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const parts: Part[] = [{ inlineData: { data: originalImageB64, mimeType: 'image/png' } }];
            
            let updatePrompt = `Edit the garment in the first image, keeping the background plain and white. Follow these steps in order:`;
            let stepCounter = 1;
    
            if (patternFile) {
                const patternBase64 = await blobToBase64(patternFile);
                parts.push({ inlineData: { data: patternBase64, mimeType: patternFile.type } });
    
                let colorInstruction = colorMode === 'solid'
                    ? `the solid color ${color}`
                    : `a linear gradient from ${gradientColor1} to ${gradientColor2} (${gradientDirection})`;
    
                updatePrompt += `\n${stepCounter}. First, recolor the entire garment with ${colorInstruction}.`;
                stepCounter++;
                
                updatePrompt += `\n${stepCounter}. Next, using the image provided after this prompt (the pattern), apply it as a repeating texture ONLY onto the garment's fabric. The color of this applied pattern should be a subtle, slightly darker shade of the garment's new base color to create a realistic tone-on-tone effect. Do not alter the white background.`;
                stepCounter++;
    
            } else {
                if (colorMode === 'solid') {
                    updatePrompt += `\n${stepCounter}. Recolor the garment to be a solid ${color}. Do not change the background.`;
                } else {
                    updatePrompt += `\n${stepCounter}. Apply a linear gradient from ${gradientColor1} to ${gradientColor2} (${gradientDirection}) to the garment. Do not change the background.`;
                }
                stepCounter++;
            }
    
            if (logoFile) {
                const logoBase64 = await blobToBase64(logoFile);
                parts.push({ inlineData: { data: logoBase64, mimeType: logoFile.type } });
                const positionDesc = getPositionDescription(logoPosition.x, logoPosition.y);
                updatePrompt += `\n${stepCounter}. Finally, place the next image provided (the logo) onto the garment's ${positionDesc} area. The logo should sit on top of any existing colors or patterns. Scale the logo to be approximately ${Math.round(logoSize)}% of the garment's width.`;
            }
    
            parts.push({ text: updatePrompt });
    
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts },
                config: { responseModalities: [Modality.IMAGE] },
            });
    
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    setGeneratedImage(`data:image/png;base64,${base64ImageBytes}`);
                }
            }
        } catch (e) {
            handleApiError(e, 'Failed to update mockup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogoMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const isResizeHandle = target.dataset.interaction === 'resize';
        const type = isResizeHandle ? 'resize' : 'drag';

        e.preventDefault();
        e.stopPropagation();

        setInteractionState({
            type,
            startX: e.clientX,
            startY: e.clientY,
            startLogoX: logoPosition.x,
            startLogoY: logoPosition.y,
            startSize: logoSize,
        });
    };

    const handleLogoTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.touches.length === 1) {
            const touch = e.touches[0];
            setInteractionState({
                type: 'drag',
                startX: touch.clientX,
                startY: touch.clientY,
                startLogoX: logoPosition.x,
                startLogoY: logoPosition.y,
                startSize: logoSize,
            });
        } else if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            
            setInteractionState({
                type: 'pinch',
                startX: 0, startY: 0, startLogoX: 0, startLogoY: 0, // Not used for pinch
                startSize: logoSize,
                initialPinchDistance: distance,
            });
        }
    };

    useEffect(() => {
        const handleInteractionMove = (e: MouseEvent | TouchEvent) => {
            if (!interactionState || !previewContainerRef.current) return;
            
            e.preventDefault();

            const rect = previewContainerRef.current.getBoundingClientRect();

            if (interactionState.type === 'pinch' && 'touches' in e && e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
                const initialDistance = interactionState.initialPinchDistance;

                if (initialDistance && initialDistance > 0) {
                    const scale = currentDistance / initialDistance;
                    const newSize = interactionState.startSize * scale;
                    setLogoSize(Math.max(5, Math.min(100, newSize)));
                }
                return;
            }
            
            if (interactionState.type === 'drag' || interactionState.type === 'resize') {
                const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
                const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

                if (clientX === undefined || clientY === undefined) return;

                const dx = clientX - interactionState.startX;
                const dy = clientY - interactionState.startY;

                if (interactionState.type === 'drag') {
                    const newX = interactionState.startLogoX + (dx / rect.width) * 100;
                    const newY = interactionState.startLogoY + (dy / rect.height) * 100;
                    setLogoPosition({
                        x: Math.max(0, Math.min(100, newX)),
                        y: Math.max(0, Math.min(100, newY)),
                    });
                } else if (interactionState.type === 'resize' && !('touches' in e)) {
                    const newSize = interactionState.startSize + (dx / rect.width) * 100;
                    setLogoSize(Math.max(5, Math.min(100, newSize)));
                }
            }
        };
        
        const handleInteractionEnd = (e: MouseEvent | TouchEvent) => {
            if (interactionState?.type === 'pinch' && 'touches' in e && e.touches.length === 1) {
                const touch = e.touches[0];
                setInteractionState({
                    type: 'drag',
                    startX: touch.clientX,
                    startY: touch.clientY,
                    startLogoX: logoPosition.x,
                    startLogoY: logoPosition.y,
                    startSize: logoSize,
                });
                return;
            }

            if (!('touches' in e) || e.touches.length === 0) {
                setInteractionState(null);
            }
        };

        if (interactionState) {
            window.addEventListener('mousemove', handleInteractionMove, { passive: false });
            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('touchmove', handleInteractionMove, { passive: false });
            window.addEventListener('touchend', handleInteractionEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchmove', handleInteractionMove);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [interactionState, logoPosition.x, logoPosition.y, logoSize]);


    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handlePatternFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPatternFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPatternPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleAlteration = async () => {
        if (!generatedImage || !alterationPrompt.trim()) return;
        if (!checkApiKey()) return;
        setIsLoading(true);
        setError(null);
        const currentImageB64 = generatedImage.split(',')[1];
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const parts: Part[] = [
                { inlineData: { data: currentImageB64, mimeType: 'image/png' } },
                { text: `Perform this single structural alteration to the garment in the image: "${alterationPrompt}". Do not change any colors, logos, patterns, or the plain white background. Only modify the garment's shape as requested.` }
            ];
    
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts },
                config: { responseModalities: [Modality.IMAGE] },
            });
    
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const newBase64 = part.inlineData.data;
                    const newImageUrl = `data:image/png;base64,${newBase64}`;
                    setGeneratedImage(newImageUrl);
                    // Set the new image as the base for future customizations
                    setOriginalImageB64(newBase64); 
                    setAlterationPrompt(''); // Clear input on success
                }
            }
        } catch (e) {
            handleApiError(e, 'Failed to alter the mockup. The AI might not be able to perform this change. Please try a different request.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMouseMoveForZoom = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!previewContainerRef.current) return;
        const rect = previewContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
    };
    
    const renderControls = () => {
        if (step === 'selection') {
            return (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">How would you like to start?</h2>
                    <button onClick={() => { setGenerationSource('describe'); setStep('generation'); }} className="w-full bg-dark text-white font-bold py-3 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center">
                        <TextIcon /> Describe a Design
                    </button>
                    <button onClick={() => { setGenerationSource('upload'); setStep('generation'); }} className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <PhotoIcon /> Upload Your Photo
                    </button>
                    <button onClick={() => { setGenerationSource('product'); setShowProductModal(true); }} className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <ProductIcon /> Choose from Products
                    </button>
                </div>
            );
        }

        if (step === 'generation') {
            return (
                <div>
                    <button onClick={() => setStep('selection')} className="text-sm text-primary mb-4">&larr; Back to start</button>
                    {generationSource === 'describe' && (
                        <div className="space-y-4">
                            <label htmlFor="prompt-input" className="block text-lg font-bold text-gray-800">1. Describe Your Design</label>
                            <textarea id="prompt-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., a short-sleeve polo shirt for men" className="w-full p-2 border rounded-md" rows={3} />
                            <button onClick={handleGenerateFromPrompt} disabled={isLoading} className="w-full bg-dark text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 flex items-center justify-center disabled:bg-gray-400">
                                <WandIcon /> Generate Mockup
                            </button>
                        </div>
                    )}
                    {generationSource === 'upload' && (
                        <div className="space-y-4">
                            <label className="block text-lg font-bold text-gray-800">1. Upload a Photo</label>
                            <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="w-full text-sm bg-white border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center">
                                {uploadedPhoto ? 'Change Photo' : 'Select Photo'}
                            </button>
                            {uploadedPhoto && (
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="text-md font-semibold">What next?</h3>
                                    <button onClick={handleUsePhotoDirectly} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md">Use This Photo</button>
                                    <button onClick={handleGenerateFromPhoto} className="w-full bg-dark text-white font-bold py-2 px-4 rounded-md flex items-center justify-center">
                                        <WandIcon /> Generate New Mockup
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        if (step === 'customization') {
            return (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">2. Customize Your Mockup</h2>
                        <button onClick={resetAll} className="text-sm text-primary font-medium">Start Over</button>
                    </div>
                    {/* Color */}
                    <div className="space-y-2">
                        <label className="flex items-center text-md font-semibold text-gray-700"><ColorPaletteIcon /> Color</label>
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button onClick={() => setColorMode('solid')} className={`w-1/2 text-sm font-medium py-1.5 rounded-md flex items-center justify-center transition-colors ${colorMode === 'solid' ? 'bg-white shadow' : 'text-gray-600'}`}>
                               <SolidIcon /> Solid
                            </button>
                            <button onClick={() => setColorMode('gradient')} className={`w-1/2 text-sm font-medium py-1.5 rounded-md flex items-center justify-center transition-colors ${colorMode === 'gradient' ? 'bg-white shadow' : 'text-gray-600'}`}>
                                <GradientIcon /> Gradient
                            </button>
                        </div>
                         {colorMode === 'solid' ? (
                            <div className="flex items-center gap-4 pt-2">
                                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 p-0 border-none rounded-md cursor-pointer" />
                                <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full p-2 border rounded-md" />
                            </div>
                         ) : (
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-around gap-4">
                                    <div className="flex flex-col items-center">
                                        <label className="text-xs text-gray-500 mb-1">Color 1</label>
                                        <input type="color" value={gradientColor1} onChange={e => setGradientColor1(e.target.value)} className="w-10 h-10 p-0 border-none rounded-md cursor-pointer" />
                                    </div>
                                     <div className="flex flex-col items-center">
                                        <label className="text-xs text-gray-500 mb-1">Color 2</label>
                                        <input type="color" value={gradientColor2} onChange={e => setGradientColor2(e.target.value)} className="w-10 h-10 p-0 border-none rounded-md cursor-pointer" />
                                    </div>
                                </div>
                                <select value={gradientDirection} onChange={e => setGradientDirection(e.target.value)} className="w-full text-sm p-2 border rounded-md">
                                    <option value="top to bottom">Top to Bottom</option>
                                    <option value="left to right">Left to Right</option>
                                    <option value="top left to bottom right">Diagonal</option>
                                </select>
                            </div>
                         )}
                    </div>
                    {/* Logo */}
                    <div className="space-y-2">
                        <label className="flex items-center text-md font-semibold text-gray-700"><UploadIcon /> Logo</label>
                        <input type="file" accept="image/png, image/jpeg" ref={logoInputRef} onChange={handleLogoFileChange} className="hidden" />
                        <button onClick={() => logoInputRef.current?.click()} className="w-full text-sm bg-white border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center">
                           {logoFile ? 'Change Logo' : 'Upload Logo'}
                        </button>
                        {logoPreview && (
                           <div className="space-y-3">
                               <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                                   <img src={logoPreview} alt="Logo preview" className="w-10 h-10 object-contain rounded"/>
                                   <p className="text-sm text-gray-600 truncate">{logoFile?.name}</p>
                                   <button onClick={() => { setLogoFile(null); setLogoPreview(null); if(logoInputRef.current) logoInputRef.current.value = ''; }} className="ml-auto text-red-500 text-xl font-bold">&times;</button>
                               </div>
                               <div>
                                   <label htmlFor="logo-size" className="text-sm font-medium text-gray-600">Size ({Math.round(logoSize)}%)</label>
                                   <input id="logo-size" type="range" min="5" max="80" value={logoSize} onChange={e => setLogoSize(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                               </div>
                               <p className="text-xs text-gray-500 text-center">Drag or pinch the logo on the mockup to position and resize.</p>
                           </div>
                        )}
                    </div>
                    {/* Pattern */}
                    <div className="space-y-2">
                        <label className="flex items-center text-md font-semibold text-gray-700"><PatternIcon /> Custom Pattern</label>
                        <input type="file" accept="image/png, image/jpeg" ref={patternInputRef} onChange={handlePatternFileChange} className="hidden" />
                        <button onClick={() => patternInputRef.current?.click()} className="w-full text-sm bg-white border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center">
                           {patternFile ? 'Change Pattern' : 'Upload Pattern Image'}
                        </button>
                        {patternPreview && (
                           <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                               <img src={patternPreview} alt="Pattern preview" className="w-10 h-10 object-cover rounded"/>
                               <p className="text-sm text-gray-600 truncate">{patternFile?.name}</p>
                               <button onClick={() => { setPatternFile(null); setPatternPreview(null); if(patternInputRef.current) patternInputRef.current.value = ''; }} className="ml-auto text-red-500 text-xl font-bold">&times;</button>
                           </div>
                        )}
                    </div>
                    <button onClick={handleUpdate} disabled={isLoading} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center disabled:bg-gray-400">
                        {isLoading ? 'Updating...' : 'Update Mockup'}
                    </button>

                    <div className="border-t pt-4 mt-4 space-y-2">
                        <label className="flex items-center text-md font-semibold text-gray-700"><ScissorsIcon /> Alter Design</label>
                        <p className="text-xs text-gray-500">Describe a structural change, like "make the sleeves short" or "add a hood".</p>
                        <textarea 
                            value={alterationPrompt} 
                            onChange={e => setAlterationPrompt(e.target.value)} 
                            placeholder="e.g., change to a v-neck"
                            className="w-full p-2 border rounded-md" 
                            rows={2} />
                        <button 
                            onClick={handleAlteration} 
                            disabled={isLoading || !alterationPrompt.trim()} 
                            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:bg-gray-400">
                            Apply Alteration
                        </button>
                    </div>

                    <div className="border-t pt-6 mt-6 space-y-4">
                         <button disabled={isLoading || !generatedImage} className="w-full bg-dark text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center disabled:bg-gray-400">
                            <RotateIcon />
                            Generate 360° View (Coming Soon)
                        </button>
                    </div>
                </div>
            );
        }
    };
    
    return (
        <>
            <ProductSelectionModal isOpen={showProductModal} onClose={() => setShowProductModal(false)} onSelect={handleProductSelect} />
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* --- Preview Pane --- */}
                    <div className="lg:col-span-7">
                        <div
                            ref={previewContainerRef}
                            className="group aspect-square bg-gray-100 rounded-lg flex items-center justify-center sticky top-24 p-4 relative overflow-hidden"
                            style={{ cursor: interactionState?.type === 'drag' ? 'grabbing' : (zoomActive ? 'crosshair' : 'default') }}
                            onMouseEnter={() => { if (generatedImage && !interactionState) setZoomActive(true); }}
                            onMouseLeave={() => setZoomActive(false)}
                            onMouseMove={handleMouseMoveForZoom}
                        >
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm z-20">
                                    <EngagingLoader />
                                </div>
                            )}
                            
                            {!generatedImage && !uploadedPhoto && !isLoading && (
                                <div className="text-center text-gray-500">
                                    <p>Your mockup will appear here.</p>
                                    <p className="text-sm">Choose an option on the right to begin.</p>
                                </div>
                            )}

                             {error && !isLoading && (
                                <div className="text-center text-red-500 p-4">
                                   <p className="font-semibold">An Error Occurred</p>
                                   <p className="text-sm">{error}</p>
                                </div>
                            )}
                            
                            {(generatedImage || (uploadedPhoto && !generatedImage)) && (
                                <div 
                                    className="w-full h-full relative"
                                    style={{
                                        transform: zoomActive ? 'scale(2.5)' : 'scale(1)',
                                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                        transition: 'transform 0.2s ease-out'
                                    }}
                                >
                                    <img 
                                        src={generatedImage || uploadedPhoto?.preview} 
                                        alt="Generated mockup" 
                                        className="w-full h-full object-contain rounded-lg" 
                                        style={{ opacity: isLoading ? 0.5 : 1 }}
                                    />
                                    
                                    {logoPreview && (
                                        <div
                                            className="absolute cursor-grab active:cursor-grabbing has-[[data-interaction='resize']]:active:cursor-se-resize"
                                            style={{
                                                left: `${logoPosition.x}%`,
                                                top: `${logoPosition.y}%`,
                                                width: `${logoSize}%`,
                                                transform: 'translate(-50%, -50%)',
                                                touchAction: 'none'
                                            }}
                                            onMouseDown={handleLogoMouseDown}
                                            onTouchStart={handleLogoTouchStart}
                                        >
                                            <img src={logoPreview} alt="Logo overlay" className="w-full h-auto pointer-events-none" />
                                            <div
                                                data-interaction="resize"
                                                className="absolute -right-1 -bottom-1 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-se-resize hidden sm:block"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                             {generatedImage && !isLoading && !interactionState && (
                                <div className="absolute top-2 right-2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                    <MagnifyingGlassPlusIcon />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Controls Pane --- */}
                    <div className="lg:col-span-5">
                        {renderControls()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MockupGenerator;
