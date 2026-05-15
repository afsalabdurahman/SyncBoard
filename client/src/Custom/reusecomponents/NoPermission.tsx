 export const  NoPermission = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        
        {/* Warning Circle */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <span className="text-4xl font-bold text-red-600">✕</span>
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-2xl font-bold text-gray-800">
          No Permission
        </h1>

        {/* Message */}
        <p className="mt-3 text-gray-600">
          You are not authorized to access this page.
        </p>

       
       
      </div>
    </div>
  );
};

