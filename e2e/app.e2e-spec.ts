describe("MetaHumanDB App", () => {

let aliasClick = () => {//Fails when clickable, passes when not.
  aliasBtn.click()
  .then(
    () => {
      throw ("This Element is clickable.");
    },
    () => {
      console.log("This Element is not clickable.")
    }
  )
};

  beforeEach( () => {
    browser.get("http://localhost:4200/");
  });

  let meta1 = element(by.id("the-list")).all(by.tagName("li")).get(0);
  let meta2 = element(by.id("the-list")).all(by.tagName("li")).get(1);
  let welcomeMessage = element(by.id("welcome-message"));
  let ratinglabels = element(by.id("rating-labels"));
  let imageParentFront = element.all(by.className("front")).first();
  let imageParentBack = element(by.css(".back img"));
  let imageBack = element(by.className("showAlias"));
  let profileButton = element(by.id("profile-btn"));
  let bargroup = element(by.className("bar-group"));
  let bttnmask = element(by.className("bttn-mask"));
  let profile = element(by.id("profile-panel"));
  let detail = element(by.className("detail"));
  let aliasBtn = element(by.id("alias-btn"));
  let metas = element(by.className("metas"));
  let weaponry = element(by.id("weaponry"));
  let miniIronMan = element(by.css("img"));
  let image = element(by.id("headshot"));
  let rating = element(by.id("rating"));
  let arrow = element(by.id("profile-img"));
  let title = element(by.tagName("h1"));
  let name = element(by.id("name"));

  /////PRE-CLICK////

  describe("MetasComponent", () => {

    it("Should only show pre-click data/components", () => {
      expect(browser.getTitle()).toEqual("MetaHumanDB");//should show page title.
      expect(miniIronMan.isPresent()).toBe(true);
      expect(metas.isPresent()).toBe(true);//should show list of meta buttons
      expect(detail.isPresent()).toBe(false);//should not show any details
      expect(bargroup.isPresent()).toBe(false);//should not show any rating bars
      expect(aliasBtn.isPresent()).toBe(false);
    });

  });

  describe("WelcomeMessageComponent", () => {

    it("should be present and visible", () => {
      expect(miniIronMan.isPresent()).toBe(true);
      expect(welcomeMessage.isPresent()).toBe(true);
      expect(welcomeMessage.isDisplayed()).toBe(true);
      welcomeMessage.getText().then((result) => {//returns a promise, needs .then to resolve.
      expect(result).not.toBe("");
      });
    });

  });

  /////POST-CLICK////


  describe("Title", () => {

    it("when clicked should launch Welcome Message with Mini Iron Man", () => {
      meta2.click();
      title.click();
      expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/welcome");
      expect(miniIronMan.isPresent()).toBe(true);
      expect(welcomeMessage.isPresent()).toBe(true);
      expect(welcomeMessage.isDisplayed()).toBe(true);
      welcomeMessage.getText().then((result) => {
        expect(result).not.toBe("");
      });
    });

  });


  describe("AppComponent", () => {

    it("should route to the home page on Title click", () => {
      meta1.click();
      expect(name.getText()).toEqual("IRON MAN");
      title.click();
      expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/welcome");
    });

    it("should reset the alias button on Title click", () => {
      meta1.click();
      expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/detail/1");
      profileButton.click();
      title.click();
      expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/welcome");
      meta1.click();
      aliasBtn.click()//Passes when clickable, fails when not.
      .then(
        () => {
          console.log("Alias Button is clickable.")
        },
        () => {
          throw ("Alias Button is not clickable.");
        }
      )
    });

  });


  describe("Meta-Human Detail", () => {

    it("should show all details of selected meta post-click", () => {
      let alias = element(by.id("alias"));

      meta1.click();
      expect(welcomeMessage.isPresent()).toBe(false);//should disappear from the DOM.
      expect(name.isPresent()).toBe(true);//should show name...
      expect(aliasBtn.isPresent()).toBe(true);//should show alias button...
      expect(image.isPresent()).toBe(true);//should show image...
      expect(ratinglabels.isPresent()).toBe(true);//should show rating info...
      expect(bargroup.isDisplayed()).toBe(true);//should show rating bars...
      expect(weaponry.isPresent()).toBe(true);//should show metadata.
      expect(imageParentFront.getAttribute("alt")).toEqual("Iron Man image");
      expect(imageParentBack.getAttribute("alt")).toEqual("Tony Stark image");
    });

  });


  describe("Deep Info", () => {

    it("clicking Alias button should flip image (make back visible, make front invisible)", () => {
      meta1.click();
      expect(imageBack.isPresent()).toBe(false);
      aliasBtn.click();
      expect(imageBack.isPresent()).toBe(true);
      expect(imageBack.isDisplayed()).toBe(true)
    });

  });


  describe("Profile panel", () => {

    it("clicking profile button should display profile and de-activate the alias button", () => {
      meta1.click();
      expect(profile.isPresent()).toBe(false);
      expect(bttnmask.isPresent()).toBe(false);
      expect(aliasBtn.isDisplayed()).toBe(true);
      profileButton.click();
      expect(aliasBtn.isPresent()).toBe(true);
      expect(aliasBtn.isDisplayed()).toBe(true);
      expect(arrow.isDisplayed()).toBe(true);
      expect(profile.isPresent()).toBe(true);
      let b = browser.wait(() => {
        return profile.isDisplayed().then((disp) => {
        return disp;
      });
    }, 10000);
      expect(b).toBe(true)
      aliasClick();
      //Fails when clickable, passes when not
    });

    describe("Browser Nav Buttons", () => {

      it("navigates to previous meta", () => {
        meta1.click();
        meta2.click();
        browser.navigate().back();
        expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/detail/1");
        expect(name.getText()).toEqual("IRON MAN");
        browser.navigate().forward();
        expect(browser.getCurrentUrl()).toEqual("http://localhost:4200/detail/2");
        expect(name.getText()).toEqual("CAPTAIN AMERICA");
      });

    });

  });

});
