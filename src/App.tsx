import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Upload } from 'lucide-react';

const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertToWords(num: number): string {
    if (num === 0) return 'Zero';
    if (num < 0) return 'Minus ' + convertToWords(Math.abs(num));
    
    let words = '';
    
    if (num >= 10000000) {
        words += convertToWords(Math.floor(num / 10000000)) + ' Crore ';
        num %= 10000000;
    }
    
    if (num >= 100000) {
        words += convertToWords(Math.floor(num / 100000)) + ' Lac ';
        num %= 100000;
    }
    
    if (num >= 1000) {
        words += convertToWords(Math.floor(num / 1000)) + ' Thousand ';
        num %= 1000;
    }
    
    if (num >= 100) {
        words += convertToWords(Math.floor(num / 100)) + ' Hundred ';
        num %= 100;
    }
    
    if (num > 0) {
        if (words !== '') words += 'and ';
        if (num < 20) {
            words += singleDigits[num] + ' ';
        } else {
            words += tens[Math.floor(num / 10)] + ' ';
            if (num % 10 > 0) {
                words += singleDigits[num % 10] + ' ';
            }
        }
    }
    
    return words.trim();
}

function parseAmount(str: string): number {
  if (!str) return 0;
  const isNegative = str.toString().trim().startsWith('-');
  const cleanStr = str.toString().replace(/[^0-9.]/g, "");
  if (!cleanStr) return 0;
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : (isNegative ? -num : num);
}

function formatAmount(num: number): string {
  if (num === 0) return "0/-";
  const str = Math.floor(Math.abs(num)).toString();
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const val = otherNumbers !== '' ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree : lastThree;
  return (num < 0 ? "-" : "") + val + "/-";
}

// Reusable Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (val: string) => void;
}

const Input: React.FC<InputProps> = ({ value, onChangeValue, className, ...props }) => {
  return (
    <input
      value={value}
      onChange={e => onChangeValue(e.target.value)}
      className={`bg-transparent outline-none border border-transparent hover:border-gray-300 focus:border-gray-400 focus:bg-white/50 print:border-transparent print:bg-transparent transition-all px-1 py-[2px] rounded-sm placeholder-gray-400 ${className || ''}`}
      {...props}
    />
  );
};

export default function App() {
  // Global Setup
  const [docType, setDocType] = useState('Bill');
  const [logoUrl, setLogoUrl] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');
  
  // Header Info
  const [businessName, setBusinessName] = useState('Prantography');
  const [headerLines, setHeaderLines] = useState([
    "B3, Rabbee House, CEN (B, 11 Rd",
    "99, Dhaka 1212",
    "Contact: +8801798613561",
    "Mail: Prantography@gmail.com",
    "Website: Prantography.com"
  ]);

  // Invoice Details
  const [docNo, setDocNo] = useState('0388');
  const [date, setDate] = useState('13.04.2026');
  const [clientName, setClientName] = useState('InnStar Limited');
  const [purposes, setPurposes] = useState(['Elements by InnStar photography']);
  
  const [total, setTotal] = useState('1,00,000/-');
  const [advance, setAdvance] = useState('50,000/-');
  const [amountInWords, setAmountInWords] = useState('One lac Taka Only');
  const [isAmountEdited, setIsAmountEdited] = useState(false);

  // Footer Info
  const [preparedByName, setPreparedByName] = useState('Mehedi Hasan Junaid');
  const [preparedByTitle, setPreparedByTitle] = useState('Photographer, Prantography');

  // Calculates dynamically
  const dueAmount = formatAmount(parseAmount(total) - parseAmount(advance));
  
  const docNoLabel = docType === 'Invoice' ? 'Invoice No' : docType === 'Bill' ? 'No' : 'Receipt No';

  useEffect(() => {
    if (!isAmountEdited && parseAmount(total) > 0) {
      setAmountInWords(convertToWords(parseAmount(total)) + ' Taka Only');
    }
  }, [total, isAmountEdited]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSignatureUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] py-8 flex flex-col items-center print:py-0 print:bg-white font-sans text-gray-900 selection:bg-gray-200">
      
      {/* Print Controls (Non-Printable) */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 no-print px-4">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Invoice Generator</h1>
        <button 
          onClick={() => window.print()} 
          className="flex items-center gap-2 px-6 py-2.5 bg-[#111] text-white rounded-lg hover:bg-[#333] transition-all shadow-md font-medium text-sm"
        >
          <Printer size={16} /> Print / Download PDF
        </button>
      </div>

      {/* A4 Document Container */}
      <div 
        className="a4-page print-exact bg-[#fdfdfd] shadow-2xl flex flex-col relative w-full overflow-hidden" 
        style={{ maxWidth: '210mm', minHeight: '297mm' }}
      >
        
        {/* === HEADER SECTION === */}
        <div className="bg-[#cdcdcd] print-exact w-full px-12 md:px-16 pt-12 pb-10 flex flex-col md:flex-row justify-between items-start shrink-0 z-10 relative border-b border-[#c4c4c4]">
          {/* Logo */}
          <div className="relative group w-[120px] mb-6 md:mb-0">
             {logoUrl ? (
               <div className="relative">
                  <img src={logoUrl} alt="Logo" className="max-w-[120px] max-h-[120px] object-contain pointer-events-none" />
                  <button 
                    onClick={() => setLogoUrl("")} 
                    className="no-print absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-white text-red-500 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                     <Trash2 size={12}/>
                  </button>
               </div>
             ) : (
               <div className="no-print w-20 h-24 border border-dashed border-gray-400 flex flex-col items-center justify-center text-xs text-gray-600 rounded cursor-pointer bg-white/40 hover:bg-white transition-colors relative">
                  <Upload size={18} className="mb-1 opacity-70"/>
                  <span className="text-center font-medium opacity-80 leading-tight">Upload<br/>Logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               </div>
             )}
          </div>
          
          {/* Business Details */}
          <div className="text-left md:text-right flex flex-col space-y-[2px] w-full md:w-auto mt-2">
             <Input 
               value={businessName} 
               onChangeValue={setBusinessName} 
               className="text-2xl md:text-[28px] font-bold text-[#111] leading-none mb-1 md:text-right" 
               placeholder="Business Name"
             />
             {headerLines.map((line, i) => (
                <div key={i} className="flex items-center justify-end group">
                   <Input 
                     value={line} 
                     onChangeValue={v => {
                       const newLines = [...headerLines];
                       newLines[i] = v;
                       setHeaderLines(newLines);
                     }} 
                     className="text-[13px] text-[#222] md:text-right min-w-[240px] leading-snug" 
                     placeholder="Address/Contact line"
                   />
                   <button 
                     onClick={() => setHeaderLines(headerLines.filter((_, idx) => idx !== i))}
                     className="no-print opacity-0 group-hover:opacity-100 text-red-500 hover:bg-white/50 p-1 rounded transition-all absolute md:relative -right-6 md:right-auto md:ml-1"
                   >
                     <Trash2 size={12} />
                   </button>
                </div>
             ))}
             <button 
               className="no-print text-[11px] text-gray-500 hover:text-gray-900 transition-colors mt-2 flex items-center justify-start md:justify-end w-full tracking-wide uppercase font-semibold" 
               onClick={() => setHeaderLines([...headerLines, ""])}
             >
               <Plus size={10} className="mr-1"/> Add line
             </button>
          </div>
        </div>

        {/* === MAIN BODY SECTION === */}
        <div className="px-12 md:px-16 pt-12 pb-16 flex-1 flex flex-col relative bg-[#fdfdfd] z-0">
           
           {/* Watermark (Centered over amount section as per spec) */}
           {logoUrl && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none z-0 mt-24">
                <img src={logoUrl} className="w-[300px] h-[300px] object-contain grayscale" alt="" />
             </div>
           )}

           <div className="relative z-10 w-full flex flex-col flex-1">
             
             {/* Document Type Title Box */}
             <div className="flex justify-center mb-12 -mt-[20px]">
               <div className="border-[1.8px] border-[#111] rounded-[10px] px-10 py-1.5 text-[32px] font-bold text-[#111] relative bg-white group hover:bg-gray-50 transition-colors select-none shadow-sm print:shadow-none min-w-[160px] text-center">
                  <select 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                    value={docType} 
                    onChange={e => setDocType(e.target.value)}
                  >
                     <option value="Invoice">Invoice</option>
                     <option value="Bill">Bill</option>
                     <option value="Money Receipt">Money Receipt</option>
                  </select>
                  <span className="pointer-events-none tracking-tight">{docType}</span>
               </div>
             </div>

             {/* Meta Data (No & Date) */}
             <div className="mb-14 text-[14px] text-[#222]">
                <div className="flex items-center mb-1 w-max">
                   <span className="w-20 md:w-24 shrink-0 -mr-2">{docNoLabel}:</span>
                   <Input value={docNo} onChangeValue={setDocNo} className="font-medium min-w-[120px]" />
                </div>
                <div className="flex items-center w-max relative group">
                   <span className="w-20 md:w-24 shrink-0 -mr-2">Date:</span>
                   <div className="relative">
                      <Input value={date} onChangeValue={setDate} className="font-medium min-w-[120px] placeholder-gray-400" placeholder="DD.MM.YYYY" />
                      {/* Hidden native date picker overlay for mobile/desktop UX */}
                      <input 
                         type="date"
                         className="absolute inset-0 opacity-0 cursor-pointer no-print w-full"
                         onChange={(e) => {
                             const d = new Date(e.target.value);
                             if(!isNaN(d.getTime())) {
                                const dd = String(d.getDate()).padStart(2, '0');
                                const mm = String(d.getMonth() + 1).padStart(2, '0');
                                const yyyy = d.getFullYear();
                                setDate(`${dd}.${mm}.${yyyy}`);
                             }
                         }}
                      />
                   </div>
                </div>
             </div>

             {/* Details Grid Array */}
             <div className="flex flex-col text-[14px] md:text-[15px] text-[#111] w-full">

                {/* 1. Received With Thanks From */}
                <div className="flex flex-col md:flex-row mb-6 mt-2 relative z-20">
                  <div className="w-full md:w-[220px] mb-1 md:mb-0 shrink-0 flex items-center pr-2">Received with thanks from</div>
                  <div className="hidden md:flex w-[20px] shrink-0 items-center justify-center font-bold">:</div>
                  <div className="flex-1">
                     <Input value={clientName} onChangeValue={setClientName} className="font-bold w-full text-[15px]" placeholder="Client Name" />
                  </div>
                </div>

                {/* 2. Purpose */}
                <div className="flex flex-col md:flex-row mb-12 relative z-20">
                  <div className="w-[220px] shrink-0 mt-1 md:mt-0 flex items-start pr-2">Purpose</div>
                  <div className="hidden md:flex w-[20px] shrink-0 font-bold items-start pt-[2px] justify-center">:</div>
                  <div className="flex-1 flex flex-col gap-1 w-full pl-0.5 md:pl-0">
                     {purposes.map((p, i) => (
                       <div key={i} className="flex items-center gap-2 group w-full relative">
                         <Input 
                           value={p} 
                           onChangeValue={v => {
                               const np = [...purposes];
                               np[i] = v;
                               setPurposes(np);
                           }} 
                           className="flex-1 w-full text-[15px]" 
                           placeholder="Description of item or service"
                         />
                         
                         {purposes.length > 1 && (
                            <button 
                              className="no-print absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-1.5 rounded transition-all" 
                              onClick={() => setPurposes(purposes.filter((_, idx) => idx !== i))}
                              title="Remove item"
                            >
                                <Trash2 size={13}/>
                            </button>
                         )}
                       </div>
                     ))}
                     
                     <button 
                       className="no-print mt-1.5 text-[11px] font-semibold uppercase tracking-wide px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md w-max flex items-center transition-colors" 
                       onClick={() => setPurposes([...purposes, ""])}
                     >
                        <Plus size={12} className="mr-1.5"/> Add Item
                     </button>
                  </div>
                </div>

                {/* 3. Amount In Words */}
                <div className="flex flex-col md:flex-row mb-6 relative z-20">
                  <div className="w-[220px] shrink-0 flex items-center pr-2">Amount of Money in word</div>
                  <div className="hidden md:flex w-[20px] shrink-0 font-bold items-center justify-center">:</div>
                  <div className="flex-1 flex items-center relative pl-0.5 md:pl-0">
                     <Input 
                        value={amountInWords} 
                        onChangeValue={(v) => { 
                          setAmountInWords(v); 
                          setIsAmountEdited(v.trim() !== ""); 
                        }} 
                        className="w-full text-[15px]" 
                     />
                     {isAmountEdited && (
                        <button 
                          onClick={() => {
                            setIsAmountEdited(false);
                            setAmountInWords(convertToWords(parseAmount(total)) + ' Taka Only');
                          }} 
                          className="no-print absolute right-0 text-[10px] uppercase font-bold tracking-wider text-blue-500 hover:bg-blue-50 px-2 py-1 rounded"
                          title="Click to recalculate automatically"
                        >
                          Auto
                        </button>
                     )}
                  </div>
                </div>

                {/* 4. Total */}
                <div className="flex flex-col md:flex-row mb-6 relative z-20">
                  <div className="w-[220px] shrink-0 flex items-center pr-2">Total</div>
                  <div className="hidden md:flex w-[20px] shrink-0 font-bold items-center justify-center">:</div>
                  <div className="flex-1 pl-0.5 md:pl-0">
                     <Input value={total} onChangeValue={setTotal} className="w-full font-medium text-[15px]" />
                  </div>
                </div>

                {/* 5. Advance */}
                <div className="flex flex-col md:flex-row mb-6 relative z-20">
                  <div className="w-[220px] shrink-0 flex items-center pr-2">Advance</div>
                  <div className="hidden md:flex w-[20px] shrink-0 font-bold items-center justify-center">:</div>
                  <div className="flex-1 pl-0.5 md:pl-0">
                     <Input value={advance} onChangeValue={setAdvance} className="w-full font-medium text-[15px]" />
                  </div>
                </div>

                {/* 6. Due */}
                <div className="flex flex-col md:flex-row mb-6 relative z-20">
                  <div className="w-[220px] shrink-0 flex items-center pr-2 text-[#111]">Due</div>
                  <div className="hidden md:flex w-[20px] shrink-0 font-bold items-center justify-center text-[#111]">:</div>
                  <div className="flex-1 flex items-center px-1">
                     <span className="font-medium text-[15px] -ml-0.5 text-[#111] tracking-wide">{dueAmount}</span>
                  </div>
                </div>

             </div>
           </div>
           
           {/* Auto-expand space to push footer to bottom. The parent container has min-height and is flex-column */}
           <div className="flex-1 min-h-[40px]"></div>

           {/* === FOOTER (Signature & Prepared By) === */}
           <div className="mt-8 text-[14px] text-[#111] relative z-20 print:mb-0">
             
             {/* Signature Image or Upload Box */}
             <div className="relative group w-56 mb-3 aspect-[2.5/1]">
                {signatureUrl ? (
                  <div className="relative w-full h-full flex items-end justify-start">
                     <img src={signatureUrl} className="max-h-full max-w-full object-contain pointer-events-none mix-blend-darken" alt="Signature" />
                     <button 
                        onClick={(e) => { e.preventDefault(); setSignatureUrl(""); }} 
                        className="no-print absolute top-0 -right-2 bg-red-500 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <Trash2 size={12}/>
                     </button>
                  </div>
                ) : (
                  <div className="no-print mt-2 w-full text-xs text-gray-400 border border-dashed border-gray-300 p-2 text-center cursor-pointer flex flex-col items-center justify-center h-20 rounded bg-white hover:bg-gray-50 transition-colors">
                    <Upload size={14} className="mb-1.5 opacity-60"/>
                    <span className="font-medium">Upload Signature</span>
                  </div>
                )}
                {/* Opaque hidden input overlay for easy clicking */}
                <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="absolute inset-0 opacity-0 cursor-pointer no-print z-10" onChange={handleSignatureUpload} />
             </div>
             
             {/* Bottom textual info */}
             <div className="uppercase tracking-[0.14em] mb-2.5 text-[11px] font-semibold text-[#555]">Prepared By</div>
             <Input 
                value={preparedByName} 
                onChangeValue={setPreparedByName} 
                className="font-bold text-[15px] block w-full mb-0.5 -ml-1 text-[#111]" 
                placeholder="Name"
             />
             <Input 
                value={preparedByTitle} 
                onChangeValue={setPreparedByTitle} 
                className="text-[13px] block w-full -ml-1 text-[#444] font-medium" 
                placeholder="Title / Company"
             />
           </div>

        </div>
      </div>
    </div>
  );
}

