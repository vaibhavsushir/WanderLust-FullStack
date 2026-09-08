const Listing = require("../models/listing");

module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path:"reviews",
    populate:{path:"author",},}).populate("owner");
  if(!listing){
     req.flash("error","Listing You Requested For Does Not Exists!");
     return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let listingData = req.body.listing;

    if (!listingData.image.url) {
        listingData.image.url =
            "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
    }

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = { url , filename };

    const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listingData.location)}`,
    {
        headers: {
            "User-Agent": "Wanderlust/1.0"
        }
    }
);

const data = await response.json();

if (data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    newListing.geometry = {
        type: "Point",
        coordinates: [lon, lat]
    };
}

    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
     req.flash("error","Listing You Requested For Does Not Exists!");
     return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing ,originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

      if(typeof req.file !== "undefined"){
      let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
      }

   req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
};