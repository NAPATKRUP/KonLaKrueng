// JSON Loader
var data;
var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    data = JSON.parse(this.responseText);
    categoriesName(data.categories);
    provinceName(data.provinces);
    priceRange(data.priceRange);
    contentGenerator(data.merchants, "ทั้งหมด");
  }
};
xmlhttp.open("GET", "ywc18.json", true);
xmlhttp.send();

// More Function
function categoriesName(data) {
    let txt = `<div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="ทั้งหมด" value="ทั้งหมด" name="type" checked>
                    <label class="custom-control-label" for="ทั้งหมด">ทั้งหมด</label>
                </div>`;
    data.forEach(function(d) {
        txt += `<div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="${d.name}" value="${d.name}" name="type">
                    <label class="custom-control-label" for="${d.name}">${d.name}</label>
                </div>`;
    });
    document.getElementById("categories").innerHTML = txt;
}

function provinceName(data) {
    let txt = `<option selected>
                    <img src="./assets/pinMap.png" />พื้นที่ใกล้ฉัน
                </option>
                <option>
                    <img src="./assets/pinMap.png" />สถานที่ทั้งหมด
                </option>`;
    data.forEach(function(d) {
        txt += `<option>${d}</option>`;
    });
    document.getElementById("provincesNav").innerHTML = txt;
    document.getElementById("provinces").innerHTML = txt;
}

function priceRange(data) {
    let txt = `<option selected>ทั้งหมด</option>`;
    data.forEach(function(d) {
        txt += `<option>${d}</option>`;
    });
    document.getElementById("priceRange").innerHTML = txt;
}

function contentGenerator(data, keyword) {
    let titleCheck = $('input[name="type"]:checked').val();
    if(titleCheck != "ทั้งหมด") document.getElementById("TitlePage").innerHTML = `<b>ผลการค้นหา ${titleCheck} ทั้งหมด</b>`;
    else document.getElementById("TitlePage").innerHTML = `<b>ผลการค้นหา ทั้งหมด</b>`;

    let txt = "";
    data.forEach(function(d) {
        if(d.subcategoryName == keyword || keyword == "ทั้งหมด" || keyword.includes(d.subcategoryName)) {
            let listRecommend = d.recommendedItems.join(", ");
            let priceActivelevel = '฿'.repeat(d.priceLevel);
            let priceInActivelevel = '฿'.repeat(4-d.priceLevel);
            txt += `<div class="card p-2 mb-2 py-2">
                        <div class="row">
                            <div class="col-md-3 col-12">
                                <img src="${d.coverImageId}" class="img_store">
                            </div>
                            <div class="col-md-7 col-12 pt-2 choiceSize">
                                <h6><b>${d.shopNameTH}</b>`;
            if(d.isOpen == "Y") {
                txt += `        <span class="ml-3 badge badge-success">เปิดอยู่</span>`;
            } else if(d.isOpen == "N") {
                txt += `        <span class="ml-3 badge badge-secondary">ปิดแล้ว</span>`;
            }
            txt += `        </h6>
                                <p>${d.subcategoryName} | <b><span>${priceActivelevel}</span></b><span>${priceInActivelevel}</span> | ${d.addressDistrictName} ${d.addressProvinceName}</p>
                                <hr class="w-100">
                                <p>${d.highlightText}</p>
                                <p><b>เมนูแนะนำ: </b> ${listRecommend}</p>
                                <p>`;
            d.facilities.forEach(function(f) {
                txt += `            <img src="./assets/${f}.png"/ class="facitiyIcon">`;
            });
            txt += `            </p>
                            </div>
                        </div>
                    </div>`;
        }
    });

    document.getElementById("allContent").innerHTML = txt;

    if(document.getElementById("allContent").childNodes.length != 0) document.getElementById("moreBTN").innerHTML = '<button class="btn btn-light border rounded py-3 my-4" style="width: 40%">ดูเพิ่มเติม</button>';
    else document.getElementById("moreBTN").innerHTML = '';
}

function subCategory() {
    let listOfSubcategories = "";
    let txt = `<div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="รวมทั้งหมด" value="ทั้งหมด" name="category" checked>
                    <label class="custom-control-label" for="รวมทั้งหมด">ทั้งหมด</label>
                </div>`;
    let keyword = $('input[name="type"]:checked').val();
    data.categories.forEach(function(t) {
        if(t.name == keyword) {
            listOfSubcategories = t.subcategories;
            t.subcategories.forEach(function(s) {
                txt += `<div class="custom-control custom-radio">
                            <input type="radio" class="custom-control-input" id="${s}" value="${s}" name="category">
                            <label class="custom-control-label" for="${s}">${s}</label>
                        </div>`;
            });
        }
    });
    document.getElementById("subCategories").innerHTML = txt;
    if(listOfSubcategories) {
        contentGenerator(data.merchants, listOfSubcategories);
        document.getElementById("ifAll").style.display = "none";
        document.getElementById("ifNotAll").style.display = "block";
    }
    else {
        contentGenerator(data.merchants, "ทั้งหมด");
        document.getElementById("ifAll").style.display = "block";
        document.getElementById("ifNotAll").style.display = "none";
    }
}

function fliterContent() {
    let keyword = $('input[name="category"]:checked').val();
    if(keyword != "ทั้งหมด") {
        contentGenerator(data.merchants, keyword);
    }
    else {
        let listOfSubcategories = "";
        keyword = $('input[name="type"]:checked').val();
        data.categories.forEach(function(t) {
            if(t.name == keyword) {
                listOfSubcategories = t.subcategories;
            }
        });
        if(listOfSubcategories) contentGenerator(data.merchants, listOfSubcategories);
        else contentGenerator(data.merchants, "ทั้งหมด");
    }
}

// Window Screen
window.onload = function() {
    if ($(window).width() <= 766) {
        document.getElementById("page_left").classList.remove('show');
        document.getElementById("cardFilter").classList.remove('card');
    } else {
        document.getElementById("page_left").classList.add('show');
        document.getElementById("cardFilter").classList.add('card');
    }
}

window.onresize = function() {
    if ($(window).width() <= 766) {
        document.getElementById("page_left").classList.remove('show');
        document.getElementById("cardFilter").classList.remove('card');
    } else {
        document.getElementById("page_left").classList.add('show');
        document.getElementById("cardFilter").classList.add('card');
    }
}