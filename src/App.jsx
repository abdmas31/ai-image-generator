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
<div className="min-h-screen bg-gray-800 overflow-auto">
  <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-start gap-8">
  <h1 className="text-4xl font-bold text-white mb-4 mt-4">AI Image Generator</h1>
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
      <input 
        type="text" 
        placeholder="Describe your image..."
        onChange={(e)=>{onChangeHandler(e)}}
        value={input}
        className="w-[50%] p-3 rounded-lg bg-gray-700 text-white"
      />
      <button disabled={loading} type='submit' className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 mt-2">
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
    </form>
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