import { useState } from 'react'

function App() {
    const [input,setInput] = useState('');
    const [loading, setLoading] = useState(false);
    //To Store the Image url and replace the default text
    const [imageUrl, setImageUrl] = useState('');

    const generateImage = async(input)=>{
      try{
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            prompt: input,
            n: 1,
            size: '512x512'
          })
        });
        const data = await response.json();
        return data.data[0].url;
      }catch(error){
        console.error('Error:', error);
        return null;
      }
    }

    const onChangeHandler=(e)=>{
      setInput(e.target.value)
    }

    const handleSubmit= async(e)=>{
      e.preventDefault();
      if(input !== ''){
        setInput('');
        setLoading(true);
        const url = await generateImage(input);
        if(url){
          setImageUrl(url);
        }
        setLoading(false);
        setInput('');
      }else{
        console.error('Enter description to generate image!');
      }
    }

  return (
<div className="fixed inset-0 bg-gray-800 overflow-y-auto">
  <div className="min-h-full w-full flex flex-col items-center p-8 gap-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white">AI Image Generator</h1>
      <p className="text-gray-400 font-medium mt-2">Built by Abdallah Massarwe</p>
    </div>
    <div className="w-full max-w-3xl px-4">
      <form className="flex flex-col items-center gap-4 w-full" onSubmit={handleSubmit}>
        <input 
          className="w-full max-w-xl px-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 transition-all"
          type="text" 
          placeholder="Describe your image..."
          onChange={(e)=>{onChangeHandler(e)}}
          value={input}
        />
        <button 
          disabled={loading} 
          type='submit' 
          className="w-[200px] px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
    <div className='w-[512px] h-[512px] bg-gray-700 rounded-lg flex items-center justify-center text-white'>
      {loading ? 'Generating your image...' : 
       imageUrl ? (
         <img 
           src={imageUrl} 
           alt="Generated"
           className="max-w-full max-h-full object-contain rounded-lg p-2"
         />
       ) : 'Image will appear here'}
    </div>
  </div>
</div>
  )
}

export default App