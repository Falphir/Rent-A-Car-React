import React from 'react'
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Navbar from './Navbar';


Enzyme.configure({ adapter: new Adapter() })

// Admin
// "auth":true,"decoded":[["read-users","update-reserve","read-reserves","delete-reserve","create-room","update-room","read-reserve-client","delete-room","create-reserve","detail-reserve","delete-user"],"61d334748dce2b8904eff47f","admin","admin"]

// Guest
// "auth":false,"message":"no token provided."

// User
// "auth":true,"decoded":[["read-own-reserves","create-reserve","detail-reserve","create-favorite","read-own-favorites","delete-favorite","create-comment"],"61e42a23fea92d81fd4bc0e9","user","user"]

// Editor
// "auth":true,"decoded":[["read-own-reserves","create-reserve","detail-reserve","update-reserve","read-reserves","delete-reserve","create-room","update-room","read-reserve-client","delete-room"],"61e46c26b75b61e20f3ea060","editor","editor"]

describe("Navbar", () => {

    it("NavBar Show Editor Buttons",(done) => {

        window.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    status: 200,
                    ok: true,
                    json: () => new Promise((resolve, reject) => {
                        resolve({
                            "auth": true, "decoded": [["read-own-reserves", "create-reserve", "detail-reserve", "update-reserve", "read-reserves", "delete-reserve", "create-room", "update-room", "read-reserve-client", "delete-room"], "61e46c26b75b61e20f3ea060", "editor", "editor"]
                        });
                    })
                });
            });
        });

        const wrapper = shallow(<Navbar />);
        setImmediate(() => {

            // within `setImmediate` all of the promises have been exhausted

            wrapper.update();

            expect(wrapper.find('[data-testid="rooms"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="dashboardEditor"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="logout"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="dashboard"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="myreserves"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="myfavorites"]')).toHaveLength(0);
           
            expect(wrapper).toMatchSnapshot();

            done()

        })
    })

    it("NavBar Show Admin Buttons",(done) => {

        window.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    status: 200,
                    ok: true,
                    json: () => new Promise((resolve, reject) => {
                        resolve({
                            "auth":true,"decoded":[["read-users","update-reserve","read-reserves","delete-reserve","create-room","update-room","read-reserve-client","delete-room","create-reserve","detail-reserve","delete-user"],"61d334748dce2b8904eff47f","admin","admin"]
                        });
                    })
                });
            });
        });

        const wrapper = shallow(<Navbar />);
        setImmediate(() => {

            // within `setImmediate` all of the promises have been exhausted

            wrapper.update();

            expect(wrapper.find('[data-testid="rooms"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="dashboard"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="logout"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="dashboardEditor"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="myreserves"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="myfavorites"]')).toHaveLength(0);
           
            expect(wrapper).toMatchSnapshot();

            done()

        })
    })

    it("NavBar Show User Buttons",(done) => {

        window.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    status: 200,
                    ok: true,
                    json: () => new Promise((resolve, reject) => {
                        resolve({
                            "auth":true,"decoded":[["read-own-reserves","create-reserve","detail-reserve","create-favorite","read-own-favorites","delete-favorite","create-comment"],"61e42a23fea92d81fd4bc0e9","user","user"]
                        });
                    })
                });
            });
        });

        const wrapper = shallow(<Navbar />);
        setImmediate(() => {

            // within `setImmediate` all of the promises have been exhausted

            wrapper.update();

            expect(wrapper.find('[data-testid="rooms"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="myreserves"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="myfavorites"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="logout"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="dashboardEditor"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="dashboard"]')).toHaveLength(0);

            expect(wrapper).toMatchSnapshot();

            done()

        })
    })

    it("NavBar Show Guest Buttons",(done) => {

        window.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    status: 200,
                    ok: true,
                    json: () => new Promise((resolve, reject) => {
                        resolve({
                            "auth":false,"message":"no token provided."
                        });
                    })
                });
            });
        });

        const wrapper = shallow(<Navbar />);
        setImmediate(() => {

            // within `setImmediate` all of the promises have been exhausted

            wrapper.update();

            expect(wrapper.find('[data-testid="rooms"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="login"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="register"]')).toHaveLength(1);
            expect(wrapper.find('[data-testid="dashboard"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="logout"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="dashboardEditor"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="myreserves"]')).toHaveLength(0);
            expect(wrapper.find('[data-testid="myfavorites"]')).toHaveLength(0);
           
            expect(wrapper).toMatchSnapshot();

            done()

        })
    })

})