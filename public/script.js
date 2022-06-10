class LocalStoreController {
 constructor(storageName = "AfghanGallaryLikesa") {
  this.storageName = storageName
  if (localStorage.getItem(this.storageName) === null)
   this.set([])
 }
 has(ID) {
  return this.get().includes(ID)
 }
 add(newID) {
  this.set([...this.get(), newID])
 }
 clear() {
  this.set([])
 }
 set(list) {
  localStorage.setItem(this.storageName, JSON.stringify(list))
 }
 get() {
  return JSON.parse(
   localStorage.getItem(this.storageName)
  )
 }
 remove(ID) {
  this.set(
   this.get().filter(id => ID !== id)
  )
 }
}


const storeController = new LocalStoreController()

function like(postId) {
 // like this post using its ID
 if (storeController.has(postId)) {
  axios.get(`/dislike/${postId}`) // dislike it
   .then(res => {
    if (res.statusText === "OK") {
     storeController.remove(postId)
     checkLikedPosts()
    }
   }).catch()
 } else {
  axios.get(`/like/${postId}`) // like it
   .then(res => {
    if (res.statusText === "OK") {
     storeController.add(postId)
     checkLikedPosts()
    }
   }).catch()
 }
}

function checkLikedPosts() {
 $(() => {
  const likedClass = "liked_icon icon-heart3 text-danger"
  const NotLikeClass = "liked_icon icon-heart-outlined"
  const elements = $(".liked_icon")
  for (let index = 0; index < elements.length; index++) {
   const id = elements[index].getAttribute("data-id")
   elements[index].className = storeController.has(id) ? likedClass : NotLikeClass
  }
 })
}

checkLikedPosts()


function CopyToClipBoard() {
 navigator.clipboard.writeText(window.location.href)
 alert("Link is copied to the clipboard!")
}

$(() => {
 const photographer = $("#photographer")
 const email = $("#email")
 const location = $("#location")
 const title = $("#title")
 const keywords = $("#keywords")
 const image = $("#imageFile")
 const progressNum = $("#progress-num")
 const progressBar = $("#progress-bar")
 const uploadButton = $("#upload-button")

 function showUploadProgress() {
  progressNum.css({
   display: "unset"
  })
  progressBar.css({
   display: "flex"
  })
 }

 function hideUploadProgress() {
  progressNum.css({
   display: "none"
  })
  progressBar.css({
   display: "none"
  })
 }

 function updateProgress(percent = 0) {
  progressNum.text(percent)
  progressBar.children(".progress-bar").css({
   width: `${percent}%`
  })
 }

 const inputs = [photographer, email, location, title, keywords, image]
 inputs.forEach(input => {
  input.change(() => {


   // if all filled
   if (inputs.every(y => y.val() !== "")) {
    uploadButton[0].disabled = false
   } else {
    uploadButton[0].disabled = true
   }
  })
 })

 function reset() {
  hideUploadProgress()
  uploadButton[0].disabled = true
  inputs.forEach(input => {
   input.val("")
  })
 }

 function upload() {
  // create a FormData to let this download happen
  const data = new FormData()
  const imageFile = image[0].files[0]
  data.append("image", imageFile)
  data.append("photographer", photographer.val())
  data.append("email", email.val())
  data.append("location", location.val())
  data.append("title", title.val())
  data.append("keywords", keywords.val())
  // make request
  axios.post("/upload", data, {
    headers: {
     "Content-Type": "multipart/form-data"
    },
    onUploadProgress: function (e) {
     let loaded = e.loaded;
     let total = e.total;
     let precent = Math.floor((loaded / total) * 100);
     updateProgress(precent)
    }
   })
   .then(res => {
    console.log({
     res
    });
    alert("Image is uploaded successfully!")
    reset()
   })
   .catch(err => {
    updateProgress(0)
    showUploadProgress()
    if (confirm("Upload failed! Do you want to try again?")) {
     upload()
    } else {
     alert("Please try again later!")
    }
    // console.log(err);
   })
 }


 uploadButton.click(() => {
  updateProgress(0)
  showUploadProgress()
  upload()
 })

})