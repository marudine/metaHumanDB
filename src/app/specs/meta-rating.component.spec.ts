import { ComponentFixture, TestBed, tick, fakeAsync } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

import { DisableAliasBttnService } from "../services/disable-alias-bttn.service";
import { findStringInNode } from "../../testing/find-string-in-node";
import { MetaRatingComponent } from "../components/meta-rating.component";
import { click } from "../../testing/clicker-left";

let comp: MetaRatingComponent;
let fixture: ComponentFixture<MetaRatingComponent>;
let profileButton: DebugElement;
let arrow: DebugElement;
let HTMLnode: HTMLElement;
let dabService: DisableAliasBttnService;
let serviceSpy: jasmine.Spy;
let rabSpy: jasmine.Spy;
let profileParent: Array<Element>;


describe("MetaRatingComponent", () => {

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [ MetaRatingComponent ],
      providers: [ DisableAliasBttnService ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaRatingComponent);
    dabService = fixture.debugElement.injector.get(DisableAliasBttnService);
    serviceSpy = spyOn(dabService, "relayMessage");

    let testMeta = (
      {
        id: 1,
        name: "Thor",
        logo: "Mjolnir",
        alias: "God of Thunder",
        profile: ["Meta Profile Text"],
        headshotsFront: "assets/headshotsFront/thor.jpg",
        headshotsBack: "assets/headshotsBack/thor.jpg",
        weaponry: [""],
        level: []
      }
    );

    comp = fixture.componentInstance;
    comp.chosenMeta = testMeta;
    rabSpy = spyOn(comp, "resetAliasBtn").and.callThrough();
    profileButton = fixture.debugElement.query(By.css("#profile-btn"));
    arrow = fixture.debugElement.query(By.css("#arrow-img"));
    HTMLnode = fixture.nativeElement;
    profileParent = [].slice.call(HTMLnode.querySelectorAll("#encloser"));
    fixture.detectChanges();
  });


  describe("Profile Panel", () => {

    it("should not be visible in DOM", () => {
      expect(findStringInNode(profileParent[0], "profile-panel")).toBe(false);
    });

    it("should be visible in DOM after Profile button clicked", () => {
      click(profileButton);
      expect(profileParent.length).toEqual(1);
    });

    it("should contain a string", () => {
      click(profileButton);
      fixture.detectChanges();
      expect(profileParent[0].textContent).toContain(comp.chosenMeta.profile[0]);
    });

    it("should show name and alias", () => {
      click(profileButton);
      fixture.detectChanges();
      expect(profileParent[0].textContent).toContain("THOR");
      expect(profileParent[0].textContent).toContain("GOD OF THUNDER");
    });

    describe("hidePanel function", () => {

      it("should set the hide property to true when toggle property is true", () => {
        click(profileButton);//the template toggles the component's toggle property to true
        comp.hidePanel();
        expect(comp.hide).toBe(true);
      });

      it("should set the hide property to false", fakeAsync(() => {
        click(profileButton);//toggle == true
        click(profileButton);//toggle == false
        comp.hidePanel();
        tick(500);//with fakeAsync, tick simulates an asynchronous passing of time
        expect(comp.hide).toBe(false);
      }));

      it("Profile button click should trigger a call to the Component's hidePanel method", () => {
        let spy = spyOn(comp, "hidePanel")
        click(profileButton);
        expect(spy).toHaveBeenCalled();
      });

    });


    describe('Arrow', () => {

      it("arrow property should be false as default", () => {
        comp.arrowShow();
        expect(comp.arrow).toBe(true);
      });

      it("arrow property should be true on arrowshow invoked twice", () => {
        comp.arrowShow();
        comp.arrowShow();
        expect(comp.arrow).toBe(false);
      });

      describe('Hide class', () => {

        it('arrow image should have hide class as default', () => {
          expect(findStringInNode(arrow.nativeElement, "hide")).toBe(true);
        });

        it('arrow image should not have hide class after profile button click', () => {
          click(profileButton);
          fixture.detectChanges();
          expect(findStringInNode(arrow.nativeElement, "hide")).toBe(false);
        });

      });

      describe('Rotate classes', () => {

        it('should have rotateDown class as default', ()=> {
          expect(findStringInNode(arrow.nativeElement, "rotateDown")).toBe(true);
        });

        it('should have rotateUp class on profile button click', ()=> {
          click(profileButton);
          fixture.detectChanges();
          expect(findStringInNode(arrow.nativeElement, "rotateUp")).toBe(true);
        });

      });

    });

  });


  describe("Alias Button de-activation", () => {

    it("Service method call should follow Component method call", () => {
      expect(serviceSpy).not.toHaveBeenCalled();
      comp.messageIn();
      expect(serviceSpy).toHaveBeenCalled();
    });

    it("should trigger a call to service method with true value", () => {
      click(profileButton);
      comp.messageIn();
      expect(serviceSpy).toHaveBeenCalledWith(true);
    });

    it("should trigger a call to service method with false value", () => {
      click(profileButton);
      click(profileButton);
      comp.messageIn();
      expect(serviceSpy).toHaveBeenCalledWith(false);
    });

    it("should trigger a call to the Component's method", () => {
      let spy = spyOn(comp, "messageIn");
      click(profileButton);
      expect(spy).toHaveBeenCalled();
    });

    it("A false argument should call the resetAliasBtn function", () => {
      click(profileButton);
      click(profileButton);
      comp.messageIn();
      expect(rabSpy).toHaveBeenCalled();
    });

    it("A true argument should not call the resetAliasBtn function", () => {
      click(profileButton);
      comp.messageIn();
      expect(rabSpy).not.toHaveBeenCalled();
    });

  });

});
