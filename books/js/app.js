
const submitBtn = document.querySelector(`.book-submit`);

submitBtn.addEventListener('click' , (e)=> {
	e.preventDefault();
	getBooks();
})
	//modal

	function openModal(btn,timeout) {
		const href = btn.dataset.modal;
			const target = document.querySelector(`#${href}`);
			// console.log(target);
			if(!target.classList.contains('show')) {
				// console.log('add show');
				target.classList.add('show');

				target.style.opacity = '0';
				target.style.transform = `translate(0,30px)`;
				target.style.transition = `all ${timeout}ms ease-in-out 0s`;
				
				setTimeout(()=> {
					target.style.opacity = '1';
					target.style.transform = `translate(0,0)`;
					
				})


			}
	}

	function closeModal(btn,timeout){
		const targets = [];
			let parents = btn.parentNode;
			while(parents){
				targets.push(parents);
				parents = parents.parentNode;
			}
			// console.log(targets)
			const target = targets[3];
			// console.log(target)
			if(target.classList.contains('show')){
				target.style.opacity = '0';
				target.style.transform = `translate(0,30px)`;
				setTimeout(()=> {
					target.classList.remove('show');
				},500)
			}
	}



	//get modal btns

function modal(){
	const modalBtns = document.querySelectorAll('.btn-modal');
	const modalClose = document.querySelectorAll('.modal-close');
	// console.log(modalClose);
	modalBtns.forEach((btn,index)=> {
		btn.addEventListener('click' , (e)=> {
			e.preventDefault();
			openModal(btn,500);

		})
	})


	modalClose.forEach((btn,index)=> {
		btn.addEventListener('click', ()=> {
			closeModal(btn,500)
		})
	})
}

	
	function modalContent() {
		const btns = document.querySelectorAll('.btn-modal');
		btns.forEach((item,i)=> {
			item.addEventListener('click' , (e)=> {
				document.querySelector('#book-title').innerHTML = e.target.dataset.title;
				document.querySelector('#book-image').src = e.target.dataset.img;
				document.querySelector('#book-details-desc').innerHTML = e.target.dataset.desc;
			})
		})
	}

		

//book api functionality


	const input = document.querySelector('.book-text');
	const bookContainer = document.querySelector('.books-wrapper');
	function getBooks() {
		if(input.value !== ""){
			// console.log(input.value);


			async function getData() {
				const books = new Promise((res,rej)=> {
					const req = new XMLHttpRequest();
					req.open('GET' , `https://www.googleapis.com/books/v1/volumes?q=search+${input.value}`);
					req.onload = ()=> {
						 if (req.status == 200) {
						 	res(JSON.parse(req.responseText).items);
						 }else{
						 	console.log('error')
						 }
						
					}
					req.send();
					// console.log(req);

					
				});

				const result = await books;
				console.log(result)
				return result
				
			}

			getData().then((value)=> {
				// console.log(value);
				if(value){
					const result = value.map((item,index)=> {
					return `
						<div class="book-col">
							<div class="book-article">
								<div class="book-image">
									<img src="${item.volumeInfo.imageLinks.thumbnail}" alt="" />
								</div>
								<div class="book-desc">
									<h3 class="book-title">${item.volumeInfo.title}</h3>
									<p class="book-small-desc">
										${item.volumeInfo.description}
									</p>
									<a href="#"
									 class="cmn-btn btn-modal"
									  data-modal="book-modal" data-img="${item.volumeInfo.imageLinks.thumbnail}"
									   data-title="${item.volumeInfo.title}"
									    data-desc="${item.volumeInfo.description}">View Details</a>
									    <a
									 class="cmn-btn mt-2" href="${item.volumeInfo.infoLink}"
									  target="_blank">Go to site</a>
								</div>
							</div>
						</div>
					`
				})
				bookContainer.innerHTML = result.join();
			}else{
				bookContainer.innerHTML = `<p class="text-center" style="color: red; width: 100%; font-size: 24px;">No Results Found</p>`
			}
				
				
			}).then(()=> {
				modal();
				modalContent();
			});
		}
		




		input.value = "";
	}


