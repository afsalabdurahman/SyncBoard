export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-30 w-30  ">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
     
      </div>
    </div>
  );
}