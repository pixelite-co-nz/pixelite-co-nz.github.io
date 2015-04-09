# Pixelite blog

## Build requirements

To build this site you will need to install the following plugin.

**jekyll-mini-magick** (from the fancy branch of this github fork https://github.com/scoz/jekyll-minimagick)

This enables jekyll to create thumbnails of images.

Checkout the branch

    git clone git@github.com:scoz/jekyll-minimagick.git
    cd jekyll-minimagick
    git checkout -b test origin/fancy

then install with either:

    sudo rake install

or

    gem build jekyll-minimagick.gemspec
    sudo gem install jekyll-minimagick-0.0.2.gem --no-ri --no-rdoc

## Credits

This was initially based on [Start Bootstrap - Clean Blog](https://github.com/IronSummitMedia/startbootstrap-clean-blog) and powers [pixelite.co.nz](http://www.pixelite.co.nz/).
