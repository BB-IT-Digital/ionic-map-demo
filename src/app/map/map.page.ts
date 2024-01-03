import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Location, Locations } from '../interfaces/location';
import { Marker } from '../interfaces/marker';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
    selector: 'app-map',
    templateUrl: 'map.page.html',
    styleUrls: ['map.page.scss'],
})
export class MapPage implements OnDestroy {
    /**
 * @public
 * @property mapEl
 * @type {ElementRef<HTMLElement>}
 * @memberof MapPage
 */
    @ViewChild('map')
    public mapEl!: ElementRef<HTMLElement>;


    /**
     * @public
     * @property map
     * @type {GoogleMap}
     * @memberof MapPage
     */
    public map!: GoogleMap;


    /**
     * @public
     * @property locations
     * @type {Array<Location>}
     * @memberof MapPage
     */
    public locations: Array<Location> = [
        {
            country: 'Cambodia',
            lat: 12.4891254,
            lng: 105.7420205,
            description: ``,
            locations: [
                {
                    name: 'Bridge Bank Plc. (Headquarters)',
                    lat: 11.5594863,
                    lng: 104.9275049,
                    description: `92 Preah Norodom Blvd (41), Phnom Penh 120207`
                },
                {
                    name: 'Bridge Bank Ta Khmao Branch',
                    lat: 11.4781262,
                    lng: 104.9415201,
                    description: `NR21, Krong Ta Khmau`
                },
                {
                    name: 'Bridge Bank Tuol Kouk Branch',
                    lat: 11.5739973,
                    lng: 104.8994001,
                    description: `8&9, Samdach Penn Nouth St. (289), Phnom Penh 120408`
                },
            ]
        }
    ];


    /**
     * @public
     * @property heading
     * @type {string}
     * @memberof HomePage
     */
    public heading: string;


    /**
     * @public
     * @property description
     * @type {string}
     * @memberof HomePage
     */
    public description: string;


    /**
     * @public
     * @property locationOptions
     * @memberof HomePage
     */
    public locationOptions = {
        header: 'Asia',
        subHeader: 'Select a country from the list',
        message: 'There\'s only three :)',
        translucent: true,
    };


    /**
     * @private
     * @property markers
     * @type {Array<Marker>}
     * @memberof HomePage
     */
    private markers: Array<Marker> = [];


    /**
     * @private
     * @property ids
     * @type {Array<string>}
     * @memberof HomePage
     */
    private ids: Array<string> = [];

    /**
     * @constructor
     * Creates an instance of HomePage.
     * @memberof HomePage
     */
    constructor() {
        this.heading = 'Select a country from the above menu';
        this.description = 'Interact with the markers that are displayed for each selected country';
    }


    /**
     * @async
     * @method ionViewDidEnter
     * @description   Ionic lifecycle event fired as the component view is being entered.
     *                Here we render the map - as the DOM has now loaded :)
     * @memberof HomePage
     */
    ionViewDidEnter() {
        setTimeout(async () => {
            const currentPosition = await Geolocation.getCurrentPosition();
            await this.createMap(currentPosition);
            await this.manageMap(currentPosition);
            let cambodia = this.locations[0]
            await this.manageMarkers(cambodia);
        }, 500);
    }

    OnInit() {
        // this.createMap();
    }

    /**
     * @method ngOnDestroy
     * @description   Angular lifecycle event fired after component view has been destroyed.
     *                Here we clear out the map and all associated listeners
     * @memberof HomePage
     */
    ngOnDestroy() {
        this.map.removeAllMapListeners();
        this.map.destroy();
        this.removeMarkers();
    }

    /**
     * @private
     * @async
     * @method createMap
     * @description  Creates a GoogleMap instance which is rendered within the DOM
     * @returns {Promise<void>}
     * @memberof MapPage
     */
    private async createMap(currentPosition: Position): Promise<void> {
        this.map = await GoogleMap.create({
            id: 'google-map',
            element: this.mapEl.nativeElement,
            apiKey: environment.keys.googleMaps,
            forceCreate: true,
            config: {
                center: {
                    lat: currentPosition.coords.latitude,
                    lng: currentPosition.coords.longitude
                },
                zoom: 10
            }
        });

        // Enable marker clustering
        await this.map.enableClustering();
    }

    /**
     * @private
     * @async
     * @method    Moves the map display to the supplied coordinates
     * @param {Location} location
     * @returns {Promise<void>}
     * @memberof MapPage
     */
    private async manageMap(location: Position): Promise<void> {
        await this.map.setCamera({
            coordinate: {
                lat: location.coords.latitude,
                lng: location.coords.latitude,
            },
            animate: true,
            zoom: 11
        });
    }


    /**
     * @private
     * @async
     * @method manageMarkers
     * @description     Generates the individual markers for locations within the selected country and
     *                  listens to the marker being clicked (and subsequently handles the retrieved data)
     * @param {Location} location
     * @returns {Promise<void>}
     * @memberof MapPage
     */
    private async manageMarkers(location: Location): Promise<void> {
        this.markers = this.generateMarkers(location.locations);
        this.ids = await this.map.addMarkers(this.markers);
        this.markers.map((marker, index) => {
            marker.markerId = this.ids[index];
        });
        await this.map.setOnMarkerClickListener((event) => {
            this.manageMarker(event);
        });
    }


    /**
     * @private
     * @method manageMarker
     * @description   Manages retrieval/rendering of data from each selected marker
     * @param {*} event
     * @memberof MapPage
     */
    private manageMarker(event: any): void {
        const summary = this.markers.filter((item: any) => {
            if (item.markerId === event.markerId) {
                return item;
            }
        });

        // Render to component view
        this.heading = summary[0].title;
        this.description = summary[0].snippet;
    }


    /**
     * @private
     * @method generateMarkers
     * @param {Array<Locations>} locations
     * @description   Generates the individual map markers from the supplied locations
     * @returns {Array<any>}
     * @memberof MapPage
     */
    private generateMarkers(locations: Array<Locations>): Array<any> {
        return locations.map((location: any, index: number) => ({
            coordinate: {
                lat: location.lat,
                lng: location.lng
            },
            title: location.name,
            snippet: location.description
        }));
    }


    /**
     * @private
     * @async
     * @method removeMarkers
     * @description    Handles removal of ALL existing rendered map markers
     * @returns {Promise<void>}
     * @memberof MapPage
     */
    private async removeMarkers(): Promise<void> {
        const markers = this.markers.map((marker) => marker.markerId);
        this.map.removeMarkers(markers);
        this.ids = [];
        this.markers = [];
    }
}

