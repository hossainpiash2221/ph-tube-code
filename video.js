function getTimeString(time){
    const hour = parseInt(time/3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond/60);
    remainingSecond = remainingSecond % 60;

    return `${hour} hour ${minute} minute ${remainingSecond} second ago`;
}


// 1. fetch , load and show categories on html 

//create loadCategories
const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then(res => res.json())
        .then(data => {
            // const activeBtn = document.getElementById(`btn-${id}`);
            // activeBtn.classList.add("active");
            displayCategories(data.categories);
        })
        .catch((err) => console.log(err));
}


//create display Categories

const displayCategories = (categories) => {

    const categoriesContainer = document.getElementById("categories")

    categories.forEach(item => {
        console.log(item);

        //create button

        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML= `
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn">
            ${item.category}
        </button>
        
        `

        //add button to catagory container
        categoriesContainer.append(buttonContainer);
    });
}

const loadCategoryVideos =(id) => {
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(res => res.json())
    .then(data =>displayVideos(data.category))
    .catch((err) => console.log(err));
}

const loadDetails = async(videoId) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    console.log(data);
    displayDetails(data.video)
}

const displayDetails = (video) =>{
    const DetailsContainer = document.getElementById("modal-content");

    DetailsContainer.innerHTML = `<img src=${video.thumbnail} />
    <p> ${video.description}
    `;
    // way-1 
    // document.getElementById("showModelData").click();

    //way-2
    document.getElementById("customModal").showModal(); 

}

const loadVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
        .catch((err) => console.log(err));
}


const displayVideos = (videos) => {
    const videoContainer = document.getElementById("videos");
    videoContainer.innerHTML="";
    if(videos.length ==0){
        videoContainer.classList.remove("grid");
        videoContainer.innerHTML=`
        <div class = " flex flex-col gap-5 justify-center items-center ">
            <img class ="w-[300px]" src="Icon.png" />
            <h2 class="text-center text-xl font-bold">

                No Content Here in this Categery
            </h2>

        </div>
        
        `;
        return;
    }
    else{
        videoContainer.classList.add("grid");
    }
    videos.forEach(video => {
        // console.log(video);
        const card = document.createElement("div");
        card.innerHTML =
            `
          <figure class="h-[200px] relative">
    <img class="h-full w-full object-cover"
      src=${video.thumbnail} />

      ${video.others.posted_date.length == 0 ? "" : `<span class="absolute right-2 text-xs bottom-2 bg-black text-white p-1 rounded">${getTimeString(video.others.posted_date)} </span>`}
      
  </figure>
         <div class="px-0 py-2 flex gap-2">
         <div>
            <img class="w-10 h-10 rounded-full object-cover" src="${video.authors[0].profile_picture}"  />

         </div>

         <div class="flex items-center gap-2">
            <h2 class="font-bold">${video.title} </h2>
            
            <p class="text-gray-400">${video.authors[0].profile_name} </p>

            ${video.authors[0].verified == true ?'<img class="w-5" src="https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000"   />'  : "" }
            

         </div>
            <p> <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error"> Details </button> </p>
         </div>

        `;

        videoContainer.append(card);
    })
}
document.getElementById("search-input").addEventListener("keyup",(e) => {
    loadVideos(e.target.value)
})
loadCategories();
loadVideos();