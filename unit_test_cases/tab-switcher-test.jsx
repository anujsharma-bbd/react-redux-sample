import React from 'react';
import TabSwitchControl from '../app/pages/admin/components/controls/tab-switcher/';
import renderer from 'react-test-renderer';


//unit test cases
describe(("Tab Switcher Control ") ,() => {
    let tabs = [{ "key": "canvassers", "text": "Canvassers", "isSelected": true,"category": "admin" },
                {"key": "routes", "text": "Routes", "isSelected": false, "category": "admin" }];
    let onTabChange = (tab)=> {console.log("tab changes",tab)};

    let snap = renderer.create(
                <TabSwitchControl tabs={tabs} onTabChange={onTabChange} />
            ).toJSON();

    it("Should render tab control :: ",()=>{
        expect(snap).toMatchSnapshot(); 
    })

    it("All Tabs rendered successfully :: ",()=>{
        let tabsRendered = snap.children.filter((child)=>{
            return child.props.className.indexOf("tab-switch")>=0;
        }).length;
        expect(tabs.length).toEqual(tabsRendered); 
    })
    
    it("There is a selected Tab :: ",()=>{
            let selectedTab = snap.children.find((item)=> item.props.className.indexOf("selected")>-1);
            expect(selectedTab).not.toBeUndefined();
     })
    
    it("Tab Clicked :: ",()=>{
            let onTabChangeNew = (tab)=> { expect(nonSelectedTab.children[0]).toEqual(tab.text); };
            snap = renderer.create(
                        <TabSwitchControl tabs={tabs} onTabChange={onTabChangeNew} />
                    ).toJSON();

            let nonSelectedTab = snap.children.find((item)=> item.props.className.indexOf("selected")== -1);
            nonSelectedTab.props.onClick();
     })

    it("Class 'selected' added when Tab clicked  :: ",()=>{
            let onTabChangeNew = (tab)=> {
                tabs.forEach((t)=>{
                    t.isSelected = (t.key === tab.key);
                });
                snap = renderer.create(
                        <TabSwitchControl tabs={tabs} onTabChange={onTabChange} />
                    ).toJSON();
                let selectedTab = snap.children.find((item)=> item.props.className.indexOf("selected")> -1 && item.children.indexOf(tab.text)>-1 );
                expect(selectedTab).toBeDefined(); 
            };
            snap = renderer.create(
                        <TabSwitchControl tabs={tabs} onTabChange={onTabChangeNew} />
                    ).toJSON();

            let nonSelectedTab = snap.children.find((item)=> item.props.className.indexOf("selected")== -1);
            nonSelectedTab.props.onClick();
     })
     
})