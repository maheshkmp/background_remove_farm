from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io
from fastapi.responses import StreamingResponse

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    # Read the image
    input_image = Image.open(io.BytesIO(await file.read()))
    
    # Remove background
    output_image = remove(input_image)
    
    # Convert to bytes
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return StreamingResponse(img_byte_arr, media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)