const navigation = document.querySelector('[data-navigate]')
const btnNavigate = document.querySelectorAll('[data-navigate] button')
const labelNavigate = document.querySelector('[data-navigate] [data-info]')
const tabView = document.querySelector('[data-tab-content]')
const tabContents = document.querySelectorAll('[data-tab-content] [data-tab-item]')
const inputPPn = document.querySelector('[data-ppn-value]')
const MaxWidth = 540

for(let i = 0; i < 101; i++) {
  let defaultOption = false
  if(i == 12) {
    defaultOption = true
  }
  const createOption = document.createElement("option")
  createOption.value = `${i}`
  createOption.innerText = i === 0 ? "Tidak ada":`${i}%`
  createOption.selected = defaultOption
  inputPPn.append(createOption)
}

const updateWidth = () => {
  const singleMatchWidth = Math.min((window.innerWidth),MaxWidth)
  tabView.style.width = `${(singleMatchWidth*btnNavigate.length)}px`
  tabContents.forEach((a, g) => {
    a.style.width = singleMatchWidth+"px"
  })
  btnNavigate.forEach((b, i) => {
    if(b.getAttribute('data-view') !== "1") {
      return;
    }
    const tabCalculateWidth = (btnNavigate.length - Number(b.getAttribute('data-index')) - 1)
    const tabSize = `-${tabCalculateWidth*singleMatchWidth}px`
    tabView.style.marginLeft = tabSize
  })
}
btnNavigate.forEach((a, g) => {
  a.setAttribute('data-index', `${(btnNavigate.length - g) - 1}`)
  a.addEventListener("click", () => {
    btnNavigate.forEach((b, i) => {
      if(b.getAttribute("data-view") !== a.getAttribute("data-view")) {
        b.setAttribute("data-view", "0")
      }
    })
    a.setAttribute("data-view", "1")
    labelNavigate.style.marginRight = `${(Number(a.getAttribute('data-index')) * 100)}px`
    updateWidth()
  })
})
updateWidth()
window.addEventListener("resize", updateWidth)

const totalHargaDenganPPN = (total) => {
  const jumlahPPN = Number(inputPPn.value.replace(/[^0-9]+/g, ''))
  const penjumlahanPPN = total * (jumlahPPN / 100)
  return penjumlahanPPN + total
}

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number)
}
const replaceInputan = (value) => {
  const toValue = value
    ?.toLowerCase().trim()
    ?.replace(/k/g, '000') // Ubah format k ke {}.###
    ?.replace(/[^0-9-]+/g, '') // Hanya angka saja
  
  return Number(toValue || '0')
}
const randomId = () => {
  let textTo = ""
  const alpahbet = "abcdefg1234567890"
  for(let a = 0; a < 9; a++) {
    textTo += alpahbet[Math.floor(Math.random() * alpahbet.length)]
  }
  return textTo
}

const inputHarga = document.querySelector('[data-calculate-single-item] [name="harga"]')
const hasilHarga = document.querySelector('[data-calculate-single-item-result] [name="hasil-harga"]')
const hasilHargaDua = document.querySelector('[data-calculate-multi-item-result] [name="hasil-harga"]')
// Single Calculate
const singleCalculate = () => {
  const hitungHasil = totalHargaDenganPPN(replaceInputan(inputHarga.value))
  hasilHarga.value = formatRupiah(hitungHasil)
}
// Multi Calculate
const multiCalculate = () => {
  const hitungSemua = document.querySelectorAll('[data-calculate-multi-item] [data-calculate-multi-item-card] input[name="harga"]')
  const hitungJumlah = document.querySelectorAll('[data-calculate-multi-item] [data-calculate-multi-item-card] input[name="jumlah"]')
  let costBelanjaanArray = []
  hitungSemua.forEach((a, i) => {
    const hargasatuitem = replaceInputan(a.value)
    const totaljumlahitem = replaceInputan(hitungJumlah[i].value)
    const hitungkeseluruhan = hargasatuitem * totaljumlahitem
    costBelanjaanArray.push(hitungkeseluruhan)
  })
  const jumlahkesluruhanitem = costBelanjaanArray.reduce((acc, item) => acc + item, 0)
  const hitunghasilPPN = totalHargaDenganPPN(jumlahkesluruhanitem)
  hasilHargaDua.value = formatRupiah(hitunghasilPPN)
}
const RemoveItem = (code) => {
  event.preventDefault()
  const doc = document.querySelector(`[data-calculate-multi-item-card="${code}"]`)
  doc.classList.add("animationsideout-out")
  setTimeout(() => {
    doc.remove()
    setTimeout(() => {
      multiCalculate()
    }, 10)
  }, 298)
}
singleCalculate()
multiCalculate()
document.querySelector('[data-calculate-multi-item-resultview]').addEventListener("click", (e) => {
  e.preventDefault()
  multiCalculate()
})
document.querySelector('[data-calculate-multi-item-addcard]').addEventListener("click", (e) => {
  e.preventDefault()
  const documentCreate = document.createElement("div")
  const idDocument = randomId()
  documentCreate.className = "bg-white block animationsideout"
  documentCreate.setAttribute("data-calculate-multi-item-card", idDocument)
  documentCreate.innerHTML = `<div class="flex justify-between"><b class="w-[calc(100%-140px)] block" contenteditable>Barang tambahan</b><button class="py-1 px-3 rounded-lg font-bold bg-red-600 text-white text-[0.9rem]" onclick="RemoveItem('${idDocument}')">Hapus barang</button></div><input name="jumlah" placeholder="Jumlah item / barang" type="number" value="1" class="block w-full px-3 py-2 border-2 rounded-lg my-3"/><input name="harga" placeholder="Harga 1 item / barang" class="block w-full px-3 py-2 border-2 rounded-lg my-3"/>`
  document.getElementById('adding-card').append(documentCreate)
})
inputHarga.addEventListener("input", singleCalculate)
document.querySelector('[data-ppn-value]').addEventListener("change", () => {
  multiCalculate()
  singleCalculate()
})