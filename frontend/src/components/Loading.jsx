import {ClipLoader} from 'react-spinners';


function Loading() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <ClipLoader color={"#00BFFF"} loading={true} size={80} />
    </div>
  )
}

export default Loading