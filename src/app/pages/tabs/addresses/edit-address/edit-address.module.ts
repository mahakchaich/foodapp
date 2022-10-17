import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';

import { EditAddressPageRoutingModule } from './edit-address-routing.module';

import { EditAddressPage } from './edit-address.page';
import { ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from 'src/app/components/map/map.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EditAddressPageRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule
  ],
  declarations: [EditAddressPage,MapComponent]
})
export class EditAddressPageModule {}
